import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { parse, bad, notFound, HttpError } from "../lib/http.js";
import { getSettings } from "../models/Setting.js";
import { Donation, nextDonationNumber } from "../models/Donation.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { foundationStripe } from "../lib/stripe.js";
import { emails } from "../lib/mailer.js";

const r = Router();
const round = (n) => Math.round(n * 100) / 100;
const INTERVAL = { monthly: { interval: "month", interval_count: 1 }, quarterly: { interval: "month", interval_count: 3 }, annual: { interval: "year", interval_count: 1 } };
const limitDonate = rateLimit({ windowMs: 10 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { error: "Too many attempts, please try again shortly" } });
const limitContact = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: "Too many messages, please try again later" } });

function siteUrl(f, req) {
  const base = (f.siteUrl || req.headers.origin || "").replace(/\/$/, "");
  if (!base) throw bad("Foundation site URL is not configured");
  return base;
}

/** Public configuration for building the donate + contact forms. */
r.get("/config", async (_req, res) => {
  const f = (await getSettings()).foundation;
  res.json({
    name: f.name, currency: f.currency,
    designations: f.designations.filter(d => d.active).map(d => ({ key: d.key, label: d.label })),
    presetAmounts: f.presetAmounts, minAmount: f.minAmount, maxAmount: f.maxAmount, feePercent: f.feePercent,
    frequencies: f.frequencies, contactReasons: f.contactReasons, receiptNote: f.receiptNote,
  });
});

/** Price preview (optional — the form can also compute this itself). */
r.post("/donations/quote", async (req, res) => {
  const f = (await getSettings()).foundation;
  const b = parse(z.object({ amount: z.coerce.number().positive(), coverFee: z.boolean().default(false) }), req.body);
  const fee = b.coverFee ? round(b.amount * f.feePercent / 100) : 0;
  res.json({ amount: round(b.amount), fee, total: round(b.amount + fee) });
});

/** Creates a Stripe Checkout Session for a donation and returns its URL. */
r.post("/donations/checkout", limitDonate, async (req, res) => {
  const f = (await getSettings()).foundation;
  const b = parse(z.object({
    designation: z.string().min(1),
    amount: z.coerce.number(),
    frequency: z.enum(["one-time", "monthly", "quarterly", "annual"]).default("one-time"),
    coverFee: z.boolean().default(false),
    email: z.email().optional(), name: z.string().trim().max(120).optional(),
    anonymous: z.boolean().default(false), note: z.string().trim().max(500).optional(),
    successUrl: z.url().optional(), cancelUrl: z.url().optional(),
  }), req.body);

  const des = f.designations.find(d => d.key === b.designation && d.active);
  if (!des) throw bad("Unknown designation");
  if (!f.frequencies.includes(b.frequency)) throw bad("This frequency isn't available");
  if (!(b.amount >= f.minAmount && b.amount <= f.maxAmount)) throw bad(`Amount must be between $${f.minAmount} and $${f.maxAmount}`);
  const amount = round(b.amount);
  const fee = b.coverFee ? round(amount * f.feePercent / 100) : 0;
  const total = round(amount + fee);

  const sx = await foundationStripe();
  if (!sx) throw new HttpError(503, "Donations are not configured yet");

  // success/cancel URLs: must be on the configured foundation site (prevents open redirects)
  const base = siteUrl(f, req);
  const allowed = [base, ...f.allowedOrigins].map(u => u.replace(/\/$/, ""));
  const pick = (u, path) => (u && allowed.some(a => u.startsWith(a)) ? u : `${base}${path}`);
  const success = pick(b.successUrl, f.successPath);
  const cancel = pick(b.cancelUrl, f.cancelPath);

  const d = await Donation.create({
    number: await nextDonationNumber(), designation: { key: des.key, label: des.label }, frequency: b.frequency,
    amount, fee, total, coverFee: b.coverFee, currency: f.currency, anonymous: b.anonymous, note: b.note,
    donor: { email: b.email, name: b.name }, stripeAccount: sx.account, source: req.headers.origin || "",
  });

  const meta = { kind: "donation", donationId: String(d._id), donationNumber: d.number, designation: des.key };
  const productName = `${b.frequency === "one-time" ? "Donation" : `${b.frequency[0].toUpperCase()}${b.frequency.slice(1)} donation`} — ${des.label}`;
  const unit = Math.round(total * 100);
  const common = {
    client_reference_id: String(d._id), metadata: meta,
    ...(b.email ? { customer_email: b.email } : {}),
    submit_type: b.frequency === "one-time" ? "donate" : undefined,
    success_url: `${success}${success.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancel,
  };
  const session = b.frequency === "one-time"
    ? await sx.client.checkout.sessions.create({ ...common, mode: "payment", customer_creation: "always",
        line_items: [{ quantity: 1, price_data: { currency: f.currency, unit_amount: unit, product_data: { name: productName } } }],
        payment_intent_data: { metadata: meta, description: `${f.name} ${d.number}` } })
    : await sx.client.checkout.sessions.create({ ...common, mode: "subscription",
        line_items: [{ quantity: 1, price_data: { currency: f.currency, unit_amount: unit, recurring: INTERVAL[b.frequency], product_data: { name: productName } } }],
        subscription_data: { metadata: meta, description: `${f.name} ${d.number}` } });

  d.stripeSessionId = session.id; await d.save();
  res.status(201).json({ url: session.url, sessionId: session.id, number: d.number, amount, fee, total });
});

/** Thank-you page lookup. Returns non-sensitive details only. */
r.get("/donations/session/:id", async (req, res) => {
  let d = await Donation.findOne({ stripeSessionId: req.params.id });
  if (!d) throw notFound("Donation not found");
  // If the webhook hasn't arrived yet, confirm directly with Stripe.
  if (d.status === "pending") {
    const sx = await foundationStripe();
    const s = sx && await sx.client.checkout.sessions.retrieve(req.params.id).catch(() => null);
    if (s && (s.payment_status === "paid" || s.status === "complete")) {
      const { handleDonationEvent } = await import("../lib/donations.js");
      await handleDonationEvent({ type: "checkout.session.completed", data: { object: s } });
      d = await Donation.findById(d._id);
    }
  }
  res.json({ donation: { number: d.number, status: d.status, amount: d.amount, fee: d.fee, total: d.total, frequency: d.frequency, designation: d.designation?.label, firstName: d.anonymous ? null : (d.donor?.name || "").split(" ")[0] || null, createdAt: d.createdAt } });
});

/** Contact form. Includes a honeypot field `website` that must stay empty. */
r.post("/contact", limitContact, async (req, res) => {
  const f = (await getSettings()).foundation;
  const b = parse(z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    organization: z.string().trim().max(160).optional().default(""),
    email: z.email("Enter a valid email"),
    phone: z.string().trim().max(40).optional().default(""),
    reason: z.string().trim().min(1, "Choose a reason"),
    message: z.string().trim().min(1, "Message is required").max(5000),
    website: z.string().optional(),
  }), req.body);
  if (b.website) return res.status(201).json({ ok: true }); // bot — silently accept
  if (f.contactReasons.length && !f.contactReasons.includes(b.reason)) throw bad("Choose a valid reason");
  const m = await ContactMessage.create({ ...b, website: undefined, site: "foundation", ip: req.ip, userAgent: String(req.headers["user-agent"] || "").slice(0, 300) });
  emails.contactAlert(m); emails.contactAck(m);
  res.status(201).json({ ok: true, id: m._id, message: "Thank you — your message has been received." });
});

export default r;
