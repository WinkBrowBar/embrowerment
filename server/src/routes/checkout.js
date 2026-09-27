import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { parse, bad, notFound, HttpError } from "../lib/http.js";
import { quote } from "../lib/pricing.js";
import { requireUser } from "../middleware/auth.js";
import { stripeClient } from "../lib/stripe.js";
import { Order, nextOrderNumber } from "../models/Order.js";
import { getSettings } from "../models/Setting.js";
import { fulfillOrder } from "../lib/fulfill.js";
import { config } from "../config.js";

const r = Router();
const cents = (n) => Math.round(n * 100);
const abs = (u) => (!u ? undefined : /^https?:\/\//.test(u) ? u : `${config.apiUrl}${u.startsWith("/") ? "" : "/"}${u}`);

r.post("/checkout", requireUser, async (req, res) => {
  const b = parse(z.object({
    items: z.array(z.object({ kind: z.enum(["product", "course"]), ref: z.string().refine(mongoose.isValidObjectId), variant: z.string().optional().default(""), qty: z.coerce.number().int().min(1).max(99).default(1) })).min(1).max(50),
    coupon: z.string().trim().max(40).optional(),
  }), req.body);

  const stripe = await stripeClient();
  if (!stripe) throw new HttpError(503, "Payments are not configured yet. Please contact the concierge.");

  const q = await quote(b.items, { couponCode: b.coupon, user: req.user });
  if (!q.items.length) throw bad("Your cart is empty");
  if (q.problems.length) throw bad(q.problems[0].message, q.problems);
  if (b.coupon && q.couponError) throw bad(q.couponError);

  const s = await getSettings();
  const order = await Order.create({
    number: await nextOrderNumber(), user: req.user._id, email: req.user.email,
    items: q.items.map(i => ({ kind: i.kind, ref: i.ref, name: i.name, variant: i.variant, image: i.image, price: i.price, qty: i.qty })),
    subtotal: q.subtotal, discount: q.discount, shipping: q.shipping, tax: q.tax, total: q.total, currency: q.currency,
    coupon: q.coupon ? { code: q.coupon.code, type: q.coupon.type, value: q.coupon.value } : undefined,
    requiresShipping: q.requiresShipping, history: [{ status: "pending", note: "Checkout started" }],
  });

  const line_items = q.items.map(i => ({
    quantity: i.qty,
    price_data: { currency: q.currency, unit_amount: cents(i.price), product_data: { name: i.variant ? `${i.name} — ${i.variant}` : i.name, ...(abs(i.image) && config.isProd ? { images: [abs(i.image)] } : {}) } },
  }));
  if (q.tax > 0) line_items.push({ quantity: 1, price_data: { currency: q.currency, unit_amount: cents(q.tax), product_data: { name: "Tax" } } });

  let discounts;
  if (q.discount > 0) {
    // One-off Stripe coupon mirroring the server-computed discount (exact amount, applied once).
    const sc = await stripe.coupons.create({ amount_off: cents(q.discount), currency: q.currency, duration: "once", name: q.coupon.code, max_redemptions: 1 });
    discounts = [{ coupon: sc.id }];
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: String(order._id),
    metadata: { orderId: String(order._id), orderNumber: order.number },
    line_items, discounts,
    ...(q.requiresShipping ? {
      shipping_address_collection: { allowed_countries: s.store.shippingCountries?.length ? s.store.shippingCountries : ["US"] },
      shipping_options: [{ shipping_rate_data: { type: "fixed_amount", display_name: q.shipping ? "Standard shipping" : "Free shipping", fixed_amount: { amount: cents(q.shipping), currency: q.currency } } }],
      phone_number_collection: { enabled: true },
    } : {}),
    success_url: `${config.clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.clientUrl}/cart?cancelled=1`,
  });
  order.stripeSessionId = session.id; await order.save();
  res.json({ url: session.url, orderId: order._id, number: order.number });
});

/** Called by the success page. Verifies with Stripe directly, so orders complete even before the webhook arrives. */
r.get("/checkout/session/:id", requireUser, async (req, res) => {
  let order = await Order.findOne({ stripeSessionId: req.params.id, user: req.user._id });
  if (!order) throw notFound("Order not found");
  if (!order.fulfilledAt) {
    const stripe = await stripeClient();
    const session = stripe && await stripe.checkout.sessions.retrieve(req.params.id);
    if (session?.payment_status === "paid") order = await fulfillOrder(order._id, sessionDetails(session));
  }
  res.json({ order: orderOut(order) });
});

export function sessionDetails(session) {
  const sd = session.collected_information?.shipping_details || session.shipping_details;
  return {
    paymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    shipping: sd?.address ? { name: sd.name, ...sd.address } : undefined,
    phone: session.customer_details?.phone || undefined,
  };
}

export const orderOut = (o) => ({
  id: o._id, number: o.number, status: o.status, email: o.email, items: o.items, subtotal: o.subtotal, discount: o.discount, shipping: o.shipping, tax: o.tax, total: o.total,
  coupon: o.coupon?.code ? o.coupon : null, shippingAddress: o.shippingAddress, trackingNumber: o.trackingNumber, paidAt: o.paidAt, createdAt: o.createdAt, history: o.history,
});

r.get("/orders", requireUser, async (req, res) => {
  const orders = await Order.find({ user: req.user._id, status: { $ne: "pending" } }).sort({ createdAt: -1 });
  res.json({ orders: orders.map(orderOut) });
});
r.get("/orders/:id", requireUser, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw notFound();
  const o = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!o) throw notFound("Order not found");
  res.json({ order: orderOut(o) });
});

/** My courses */
r.get("/my/courses", requireUser, async (req, res) => {
  await req.user.populate("courses.course");
  res.json({ courses: req.user.courses.filter(c => c.course).map(c => ({ id: c.course._id, title: c.course.title, slug: c.course.slug, image: c.course.image, lessonCount: c.course.lessons.length, grantedAt: c.grantedAt })) });
});

export default r;
