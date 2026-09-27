import Stripe from "stripe";
import { getSecrets } from "../models/Setting.js";

// Optional (development only): point the SDK at stripe-mock, e.g. STRIPE_API_BASE=http://localhost:12111
const base = process.env.STRIPE_API_BASE ? new URL(process.env.STRIPE_API_BASE) : null;
const opts = base ? { host: base.hostname, port: Number(base.port) || (base.protocol === "https:" ? 443 : 80), protocol: base.protocol.replace(":", "") } : undefined;

let cached = { key: "", client: null };
export async function stripeClient() {
  const { stripeSecret } = await getSecrets();
  if (!stripeSecret) return null;
  if (cached.key !== stripeSecret) cached = { key: stripeSecret, client: new Stripe(stripeSecret, opts) };
  return cached.client;
}

const fcache = {};
/** Stripe client for Foundation donations: the foundation's own account if configured, otherwise the store account. */
export async function foundationStripe() {
  const { foundationStripeSecret, stripeSecret } = await getSecrets();
  const key = foundationStripeSecret || stripeSecret;
  if (!key) return null;
  if (!fcache[key]) fcache[key] = new Stripe(key, opts);
  return { client: fcache[key], account: foundationStripeSecret ? "foundation" : "store" };
}
