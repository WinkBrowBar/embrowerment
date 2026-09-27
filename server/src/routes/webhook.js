import { Router } from "express";
import express from "express";
import { stripeClient } from "../lib/stripe.js";
import { getSecrets } from "../models/Setting.js";
import { Order } from "../models/Order.js";
import { fulfillOrder } from "../lib/fulfill.js";
import { sessionDetails } from "./checkout.js";
import { handleDonationEvent } from "../lib/donations.js";
import { foundationStripe } from "../lib/stripe.js";

const r = Router();

// Must receive the raw body for signature verification — mounted before express.json().
r.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const stripe = await stripeClient();
  const { stripeWebhookSecret } = await getSecrets();
  if (!stripe || !stripeWebhookSecret) return res.status(503).json({ error: "Stripe webhook not configured" });

  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], stripeWebhookSecret); }
  catch (e) { return res.status(400).json({ error: `Signature verification failed: ${e.message}` }); }

  // Donation events (when the foundation shares the store's Stripe account)
  if (await handleDonationEvent(event)) return res.json({ received: true });

  const obj = event.data.object;
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      if (obj.payment_status !== "paid") break;
      const order = await Order.findOne({ _id: obj.metadata?.orderId, stripeSessionId: obj.id });
      if (order) await fulfillOrder(order._id, sessionDetails(obj));
      break;
    }
    case "checkout.session.expired": {
      await Order.updateOne({ stripeSessionId: obj.id, status: "pending" }, { $set: { status: "cancelled" }, $push: { history: { status: "cancelled", note: "Checkout expired" } } });
      break;
    }
    case "charge.refunded": {
      const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id;
      if (pi && obj.refunded) await Order.updateOne({ stripePaymentIntent: pi, status: { $ne: "refunded" } }, { $set: { status: "refunded" }, $push: { history: { status: "refunded", note: "Refunded in Stripe" } } });
      break;
    }
  }
  res.json({ received: true });
});

/** Webhook for the Foundation's own Stripe account (Settings → Embrowerment Foundation). */
r.post("/stripe-foundation", express.raw({ type: "application/json" }), async (req, res) => {
  const sx = await foundationStripe();
  const { foundationWebhookSecret, stripeWebhookSecret } = await getSecrets();
  const secret = foundationWebhookSecret || stripeWebhookSecret;
  if (!sx || !secret) return res.status(503).json({ error: "Foundation Stripe webhook not configured" });
  let event;
  try { event = sx.client.webhooks.constructEvent(req.body, req.headers["stripe-signature"], secret); }
  catch (e) { return res.status(400).json({ error: `Signature verification failed: ${e.message}` }); }
  await handleDonationEvent(event);
  res.json({ received: true });
});

export default r;
