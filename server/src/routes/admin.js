import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import slugify from "slugify";
import { z } from "zod";
import { requireAdmin } from "../middleware/auth.js";
import { parse, bad, notFound, escapeRegex } from "../lib/http.js";
import { Product } from "../models/Product.js";
import { Course } from "../models/Course.js";
import { Coupon } from "../models/Coupon.js";
import { Order, ORDER_STATUSES } from "../models/Order.js";
import { User } from "../models/User.js";
import { publicSettings, updateSettings } from "../models/Setting.js";
import { verifySmtp, emails } from "../lib/mailer.js";
import { stripeClient } from "../lib/stripe.js";
import { config } from "../config.js";
import { Donation, DONATION_STATUSES } from "../models/Donation.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { foundationStripe } from "../lib/stripe.js";

const r = Router();
r.use(requireAdmin);

const id = z.string().refine(mongoose.isValidObjectId, "Invalid id");
const slug = (s) => slugify(s, { lower: true, strict: true });
const page = (q) => ({ page: Math.max(1, Number(q.page) || 1), limit: Math.min(100, Math.max(1, Number(q.limit) || 25)) });
const byId = async (Model, v) => { if (!mongoose.isValidObjectId(v)) throw notFound(); const d = await Model.findById(v); if (!d) throw notFound(); return d; };
const unique = async (Model, s, exceptId) => { if (await Model.exists({ slug: s, ...(exceptId ? { _id: { $ne: exceptId } } : {}) })) throw bad(`Slug "${s}" is already in use`); };

/* ---------- Dashboard ---------- */
r.get("/stats", async (_req, res) => {
  const paid = { status: { $in: ["paid", "processing", "shipped", "delivered"] } };
  const since = new Date(Date.now() - 30 * 864e5);
  const [orders30, allPaid, users, products, courses, recent, lowStock] = await Promise.all([
    Order.find({ ...paid, paidAt: { $gte: since } }, "total paidAt"),
    Order.find(paid, "total"),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(), Course.countDocuments(),
    Order.find({ status: { $ne: "pending" } }).sort({ createdAt: -1 }).limit(8),
    Product.find({ trackInventory: true, active: true }),
  ]);
  const byDay = {};
  for (let i = 29; i >= 0; i--) byDay[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;
  for (const o of orders30) { const k = o.paidAt.toISOString().slice(0, 10); if (k in byDay) byDay[k] += o.total; }
  const low = lowStock.flatMap(p => p.variants.length ? p.variants.filter(v => v.stock <= 5).map(v => ({ id: p._id, name: p.name, variant: v.name, stock: v.stock })) : p.stock <= 5 ? [{ id: p._id, name: p.name, variant: "", stock: p.stock }] : []);
  res.json({
    revenue30: orders30.reduce((n, o) => n + o.total, 0), orders30: orders30.length,
    revenueAll: allPaid.reduce((n, o) => n + o.total, 0), ordersAll: allPaid.length,
    customers: users, products, courses, recent, lowStock: low.slice(0, 10),
    series: Object.entries(byDay).map(([date, total]) => ({ date, total: Math.round(total * 100) / 100 })),
  });
});

/* ---------- Uploads ---------- */
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (_req, f, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${path.extname(f.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, f, cb) => cb(/^image\/(png|jpe?g|webp|gif|avif)$/.test(f.mimetype) ? null : bad("Only image files are allowed"), true),
});
r.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) throw bad("No file uploaded");
  res.json({ url: `${config.apiUrl}/uploads/${req.file.filename}` });
});

/* ---------- Products ---------- */
const productBody = z.object({
  name: z.string().trim().min(1), slug: z.string().trim().optional(), tagline: z.string().default(""), description: z.string().default(""),
  price: z.coerce.number().min(0), compareAtPrice: z.coerce.number().min(0).optional().nullable(), category: z.string().trim().default("Brows"),
  images: z.array(z.string()).default([]), variantLabel: z.string().default("Shade"),
  variants: z.array(z.object({ name: z.string().trim().min(1), sku: z.string().optional().default(""), stock: z.coerce.number().int().min(0).default(0) })).default([]),
  stock: z.coerce.number().int().min(0).default(0), trackInventory: z.boolean().default(true),
  sections: z.array(z.object({ title: z.string().trim().min(1), body: z.string().default("") })).default([]),
  featured: z.boolean().default(false), comingSoon: z.boolean().default(false), active: z.boolean().default(true), sort: z.coerce.number().default(0),
});
r.get("/products", async (req, res) => {
  const q = req.query.q ? { name: { $regex: escapeRegex(String(req.query.q)), $options: "i" } } : {};
  res.json({ products: await Product.find(q).sort({ sort: 1, createdAt: -1 }) });
});
r.get("/products/:id", async (req, res) => res.json({ product: await byId(Product, req.params.id) }));
r.post("/products", async (req, res) => {
  const b = parse(productBody, req.body); b.slug = slug(b.slug || b.name); await unique(Product, b.slug);
  res.status(201).json({ product: await Product.create(b) });
});
r.put("/products/:id", async (req, res) => {
  const p = await byId(Product, req.params.id);
  const b = parse(productBody, req.body); b.slug = slug(b.slug || b.name); await unique(Product, b.slug, p._id);
  p.set(b); await p.save(); res.json({ product: p });
});
r.delete("/products/:id", async (req, res) => { const p = await byId(Product, req.params.id); await p.deleteOne(); res.json({ ok: true }); });

/* ---------- Courses ---------- */
const courseBody = z.object({
  title: z.string().trim().min(1), slug: z.string().trim().optional(), summary: z.string().default(""), description: z.string().default(""),
  price: z.coerce.number().min(0), image: z.string().default(""), points: z.array(z.string()).default([]),
  lessons: z.array(z.object({ _id: z.string().optional(), title: z.string().trim().min(1), videoUrl: z.string().default(""), durationMin: z.coerce.number().min(0).default(0), content: z.string().default(""), preview: z.boolean().default(false) })).default([]),
  active: z.boolean().default(true), sort: z.coerce.number().default(0),
});
r.get("/courses", async (_req, res) => {
  const courses = await Course.find().sort({ sort: 1, createdAt: -1 });
  const counts = await User.aggregate([{ $unwind: "$courses" }, { $group: { _id: "$courses.course", n: { $sum: 1 } } }]);
  const m = Object.fromEntries(counts.map(c => [String(c._id), c.n]));
  res.json({ courses: courses.map(c => ({ ...c.toObject(), students: m[String(c._id)] || 0 })) });
});
r.get("/courses/:id", async (req, res) => res.json({ course: await byId(Course, req.params.id) }));
r.post("/courses", async (req, res) => {
  const b = parse(courseBody, req.body); b.slug = slug(b.slug || b.title); await unique(Course, b.slug);
  res.status(201).json({ course: await Course.create(b) });
});
r.put("/courses/:id", async (req, res) => {
  const c = await byId(Course, req.params.id);
  const b = parse(courseBody, req.body); b.slug = slug(b.slug || b.title); await unique(Course, b.slug, c._id);
  c.set(b); await c.save(); res.json({ course: c });
});
r.delete("/courses/:id", async (req, res) => { const c = await byId(Course, req.params.id); await c.deleteOne(); res.json({ ok: true }); });

/* ---------- Coupons ---------- */
const couponBody = z.object({
  code: z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, - and _ only"), description: z.string().default(""),
  type: z.enum(["percent", "fixed"]), value: z.coerce.number().positive(), appliesTo: z.enum(["all", "products", "courses"]).default("all"),
  minSubtotal: z.coerce.number().min(0).default(0), maxUses: z.coerce.number().int().min(0).default(0), perUserLimit: z.coerce.number().int().min(0).default(0),
  startsAt: z.coerce.date().optional().nullable(), expiresAt: z.coerce.date().optional().nullable(), active: z.boolean().default(true),
}).refine(c => c.type !== "percent" || c.value <= 100, { message: "Percent must be 100 or less", path: ["value"] });
r.get("/coupons", async (_req, res) => res.json({ coupons: await Coupon.find().sort({ createdAt: -1 }) }));
r.post("/coupons", async (req, res) => {
  const b = parse(couponBody, req.body); b.code = b.code.toUpperCase();
  if (await Coupon.exists({ code: b.code })) throw bad("That code already exists");
  res.status(201).json({ coupon: await Coupon.create(b) });
});
r.put("/coupons/:id", async (req, res) => {
  const c = await byId(Coupon, req.params.id); const b = parse(couponBody, req.body); b.code = b.code.toUpperCase();
  if (await Coupon.exists({ code: b.code, _id: { $ne: c._id } })) throw bad("That code already exists");
  c.set(b); await c.save(); res.json({ coupon: c });
});
r.delete("/coupons/:id", async (req, res) => { const c = await byId(Coupon, req.params.id); await c.deleteOne(); res.json({ ok: true }); });

/* ---------- Orders ---------- */
r.get("/orders", async (req, res) => {
  const { page: p, limit } = page(req.query);
  const q = {};
  if (req.query.status) q.status = String(req.query.status); else q.status = { $ne: "pending" };
  if (req.query.q) { const s = escapeRegex(String(req.query.q)); q.$or = [{ number: { $regex: s, $options: "i" } }, { email: { $regex: s, $options: "i" } }]; }
  const [orders, total] = await Promise.all([Order.find(q).sort({ createdAt: -1 }).skip((p - 1) * limit).limit(limit), Order.countDocuments(q)]);
  res.json({ orders, total, page: p, pages: Math.ceil(total / limit) });
});
r.get("/orders/:id", async (req, res) => res.json({ order: await (await byId(Order, req.params.id)).populate("user", "name email") }));
r.patch("/orders/:id", async (req, res) => {
  const o = await byId(Order, req.params.id);
  const b = parse(z.object({ status: z.enum(ORDER_STATUSES).optional(), trackingNumber: z.string().optional(), notes: z.string().optional(), notify: z.boolean().default(true) }), req.body);
  const changed = b.status && b.status !== o.status;
  if (b.trackingNumber !== undefined) o.trackingNumber = b.trackingNumber;
  if (b.notes !== undefined) o.notes = b.notes;
  if (changed) { o.status = b.status; o.history.push({ status: b.status, note: `Updated by ${req.user.email}` }); }
  await o.save();
  if (changed && b.notify) emails.orderStatus(o);
  res.json({ order: o });
});
r.post("/orders/:id/refund", async (req, res) => {
  const o = await byId(Order, req.params.id);
  if (!o.stripePaymentIntent) throw bad("This order has no Stripe payment to refund");
  if (o.status === "refunded") throw bad("Already refunded");
  const stripe = await stripeClient(); if (!stripe) throw bad("Stripe is not configured");
  const b = parse(z.object({ amount: z.coerce.number().positive().optional() }), req.body || {});
  const refund = await stripe.refunds.create({ payment_intent: o.stripePaymentIntent, ...(b.amount ? { amount: Math.round(b.amount * 100) } : {}) });
  const full = !b.amount || b.amount >= o.total;
  if (full) o.status = "refunded";
  o.history.push({ status: full ? "refunded" : o.status, note: `Refund ${refund.id} — $${((refund.amount || 0) / 100).toFixed(2)} by ${req.user.email}` });
  await o.save(); if (full) emails.orderStatus(o);
  res.json({ order: o, refund: { id: refund.id, amount: refund.amount / 100, status: refund.status } });
});

/* ---------- Customers ---------- */
r.get("/users", async (req, res) => {
  const { page: p, limit } = page(req.query);
  const q = req.query.q ? { $or: [{ email: { $regex: escapeRegex(String(req.query.q)), $options: "i" } }, { name: { $regex: escapeRegex(String(req.query.q)), $options: "i" } }] } : {};
  const [users, total] = await Promise.all([User.find(q).sort({ createdAt: -1 }).skip((p - 1) * limit).limit(limit).populate("courses.course", "title"), User.countDocuments(q)]);
  res.json({ users: users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, active: u.active, createdAt: u.createdAt, lastLoginAt: u.lastLoginAt, courses: u.courses.filter(c => c.course).map(c => ({ id: c.course._id, title: c.course.title })) })), total, page: p, pages: Math.ceil(total / limit) });
});
r.patch("/users/:id", async (req, res) => {
  const u = await byId(User, req.params.id);
  const b = parse(z.object({ role: z.enum(["customer", "admin"]).optional(), active: z.boolean().optional(), name: z.string().optional() }), req.body);
  if (String(u._id) === String(req.user._id) && (b.role === "customer" || b.active === false)) throw bad("You can't demote or deactivate yourself");
  if (b.active === false || (b.role && b.role !== u.role)) u.tokenVersion += 1; // sign out existing sessions
  Object.assign(u, b); await u.save(); res.json({ ok: true });
});
r.post("/users/:id/courses", async (req, res) => {
  const u = await byId(User, req.params.id); const b = parse(z.object({ courseId: id }), req.body);
  if (!(await Course.exists({ _id: b.courseId }))) throw notFound("Course not found");
  if (!u.courses.some(c => String(c.course) === b.courseId)) { u.courses.push({ course: b.courseId }); await u.save(); }
  res.json({ ok: true });
});
r.delete("/users/:id/courses/:courseId", async (req, res) => {
  const u = await byId(User, req.params.id);
  u.courses = u.courses.filter(c => String(c.course) !== req.params.courseId); await u.save();
  res.json({ ok: true });
});

/* ---------- Settings ---------- */
r.get("/settings", async (_req, res) => res.json({ settings: await publicSettings(), webhookUrl: `${config.apiUrl}/api/webhooks/stripe`, foundationWebhookUrl: `${config.apiUrl}/api/webhooks/stripe-foundation`, apiUrl: config.apiUrl }));
r.put("/settings", async (req, res) => {
  const b = parse(z.object({
    store: z.object({ name: z.string(), currency: z.string().length(3).toLowerCase(), notifyEmail: z.string(), shippingFlat: z.coerce.number().min(0), freeShippingOver: z.coerce.number().min(0), taxRate: z.coerce.number().min(0).max(50), shippingCountries: z.array(z.string().length(2).toUpperCase()) }).partial().optional(),
    stripe: z.object({ mode: z.enum(["test", "live"]), publishableKey: z.string().trim(), secretKey: z.string().trim(), webhookSecret: z.string().trim() }).partial().optional(),
    smtp: z.object({ host: z.string().trim(), port: z.coerce.number().int(), secure: z.boolean(), user: z.string().trim(), pass: z.string(), fromName: z.string(), fromEmail: z.string().trim() }).partial().optional(),
    foundation: z.object({
      name: z.string(), legalName: z.string(), ein: z.string(), siteUrl: z.string().trim(), allowedOrigins: z.array(z.string().trim()),
      successPath: z.string(), cancelPath: z.string(), notifyEmail: z.string().trim(), currency: z.string().length(3).toLowerCase(),
      presetAmounts: z.array(z.coerce.number().positive()), minAmount: z.coerce.number().min(0.5), maxAmount: z.coerce.number().positive(), feePercent: z.coerce.number().min(0).max(20),
      frequencies: z.array(z.enum(["one-time", "monthly", "quarterly", "annual"])).min(1),
      designations: z.array(z.object({ key: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Designation keys: lowercase letters, numbers, dashes"), label: z.string().trim().min(1), active: z.boolean().default(true) })).min(1),
      contactReasons: z.array(z.string().trim().min(1)), receiptNote: z.string(),
      stripe: z.object({ publishableKey: z.string().trim(), secretKey: z.string().trim(), webhookSecret: z.string().trim() }).partial(),
    }).partial().optional(),
  }), req.body);
  const fs = b.foundation?.stripe;
  if (fs?.secretKey && !/^(sk|rk)_(test|live)_/.test(fs.secretKey)) throw bad("Foundation Stripe secret key should start with sk_test_ or sk_live_");
  if (fs?.webhookSecret && !fs.webhookSecret.startsWith("whsec_")) throw bad("Foundation webhook secret should start with whsec_");
  if (b.stripe?.secretKey && !/^(sk|rk)_(test|live)_/.test(b.stripe.secretKey)) throw bad("Stripe secret key should start with sk_test_ or sk_live_");
  if (b.stripe?.webhookSecret && !b.stripe.webhookSecret.startsWith("whsec_")) throw bad("Webhook secret should start with whsec_");
  if (b.stripe?.publishableKey && !/^pk_(test|live)_/.test(b.stripe.publishableKey)) throw bad("Publishable key should start with pk_test_ or pk_live_");
  await updateSettings(b);
  res.json({ settings: await publicSettings() });
});
r.post("/settings/test-smtp", async (req, res) => {
  const b = parse(z.object({ to: z.email() }), req.body);
  try { await verifySmtp(b.to); } catch (e) { throw bad(`SMTP test failed: ${e.message}`); }
  res.json({ ok: true, message: `Test email sent to ${b.to}` });
});
r.post("/settings/test-stripe", async (_req, res) => {
  const stripe = await stripeClient(); if (!stripe) throw bad("Add a Stripe secret key first");
  try { const acct = await stripe.accounts.retrieve(); res.json({ ok: true, message: `Connected to ${acct.settings?.dashboard?.display_name || acct.email || acct.id}`, livemode: acct.charges_enabled }); }
  catch (e) { throw bad(`Stripe test failed: ${e.message}`); }
});

/* ---------- Foundation: donations ---------- */
r.get("/foundation/stats", async (_req, res) => {
  const since = new Date(Date.now() - 30 * 864e5);
  const all = await Donation.find({ status: { $ne: "pending" } }, "payments frequency status donor");
  const pays = all.flatMap(d => d.payments);
  const recurring = all.filter(d => d.frequency !== "one-time" && d.status === "active");
  const perMonth = { monthly: 1, quarterly: 1 / 3, annual: 1 / 12 };
  const [unread] = await Promise.all([ContactMessage.countDocuments({ status: "new" })]);
  res.json({
    raised30: pays.filter(p => p.at >= since).reduce((n, p) => n + p.amount, 0),
    raisedAll: pays.reduce((n, p) => n + p.amount, 0),
    donors: new Set(all.map(d => d.donor?.email).filter(Boolean)).size,
    activeRecurring: recurring.length,
    monthlyRecurring: recurring.reduce((n, d) => n + (d.payments.at(-1)?.amount || 0) * (perMonth[d.frequency] || 0), 0),
    unreadMessages: unread,
  });
});
r.get("/foundation/donations", async (req, res) => {
  const { page: p, limit } = page(req.query);
  const q = {};
  if (req.query.status) q.status = String(req.query.status); else q.status = { $ne: "pending" };
  if (req.query.frequency) q.frequency = String(req.query.frequency);
  if (req.query.q) { const s = escapeRegex(String(req.query.q)); q.$or = [{ number: { $regex: s, $options: "i" } }, { "donor.email": { $regex: s, $options: "i" } }, { "donor.name": { $regex: s, $options: "i" } }]; }
  const [donations, total] = await Promise.all([Donation.find(q).sort({ createdAt: -1 }).skip((p - 1) * limit).limit(limit), Donation.countDocuments(q)]);
  res.json({ donations, total, page: p, pages: Math.ceil(total / limit) });
});
r.get("/foundation/donations/:id", async (req, res) => res.json({ donation: await byId(Donation, req.params.id) }));
r.post("/foundation/donations/:id/cancel", async (req, res) => {
  const d = await byId(Donation, req.params.id);
  if (!d.stripeSubscriptionId) throw bad("This is not a recurring donation");
  const sx = await foundationStripe(); if (!sx) throw bad("Stripe is not configured");
  await sx.client.subscriptions.cancel(d.stripeSubscriptionId);
  d.status = "cancelled"; d.cancelledAt = new Date(); await d.save();
  res.json({ donation: d });
});
r.post("/foundation/donations/:id/refund", async (req, res) => {
  const d = await byId(Donation, req.params.id);
  const pi = d.stripePaymentIntent || d.payments.at(-1)?.paymentIntent;
  if (!pi) throw bad("No Stripe payment to refund");
  const sx = await foundationStripe(); if (!sx) throw bad("Stripe is not configured");
  const refund = await sx.client.refunds.create({ payment_intent: pi });
  if (d.frequency === "one-time") d.status = "refunded";
  await d.save();
  res.json({ donation: d, refund: { id: refund.id, amount: refund.amount / 100, status: refund.status } });
});
r.post("/foundation/donations/:id/resend-receipt", async (req, res) => {
  const d = await byId(Donation, req.params.id);
  if (!d.donor?.email) throw bad("No donor email on file");
  const ok = await emails.donationReceipt(d);
  if (!ok) throw bad("Email could not be sent — check SMTP settings");
  res.json({ ok: true });
});
r.patch("/foundation/donations/:id", async (req, res) => {
  const d = await byId(Donation, req.params.id);
  const b = parse(z.object({ status: z.enum(DONATION_STATUSES).optional(), note: z.string().optional() }), req.body);
  Object.assign(d, b); await d.save(); res.json({ donation: d });
});

/* ---------- Foundation: contact messages ---------- */
r.get("/foundation/messages", async (req, res) => {
  const { page: p, limit } = page(req.query);
  const q = req.query.status ? { status: String(req.query.status) } : { status: { $nin: ["archived", "spam"] } };
  if (req.query.q) { const s = escapeRegex(String(req.query.q)); q.$or = [{ name: { $regex: s, $options: "i" } }, { email: { $regex: s, $options: "i" } }, { message: { $regex: s, $options: "i" } }]; }
  const [messages, total] = await Promise.all([ContactMessage.find(q, "-ip -userAgent").sort({ createdAt: -1 }).skip((p - 1) * limit).limit(limit), ContactMessage.countDocuments(q)]);
  res.json({ messages, total, page: p, pages: Math.ceil(total / limit) });
});
r.patch("/foundation/messages/:id", async (req, res) => {
  const m = await byId(ContactMessage, req.params.id);
  const b = parse(z.object({ status: z.enum(["new", "read", "replied", "archived", "spam"]).optional(), notes: z.string().optional() }), req.body);
  Object.assign(m, b); await m.save(); res.json({ message: m });
});
r.delete("/foundation/messages/:id", async (req, res) => { const m = await byId(ContactMessage, req.params.id); await m.deleteOne(); res.json({ ok: true }); });

export default r;