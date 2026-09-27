import { Donation } from "../models/Donation.js";
import { emails } from "./mailer.js";

const cents = (n) => Math.round(n * 100) / 100;
const subIdOf = (inv) => (typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id)
  || inv.parent?.subscription_details?.subscription || inv.subscription_details?.subscription || null;
const metaOf = (inv) => inv.parent?.subscription_details?.metadata || inv.subscription_details?.metadata || inv.lines?.data?.[0]?.metadata || {};

/** Records one successful charge exactly once; sends a receipt for it. Returns true if newly recorded. */
async function recordPayment(donation, { key, amount, paymentIntent, invoice }) {
  const r = await Donation.updateOne(
    { _id: donation._id, "payments.invoice": { $ne: key } },
    { $push: { payments: { at: new Date(), amount, invoice: key, paymentIntent } }, $inc: { totalReceived: amount } },
  );
  if (!r.modifiedCount) return false;
  const fresh = await Donation.findById(donation._id);
  emails.donationReceipt(fresh); fresh.receiptSentAt = new Date(); await fresh.save();
  if (fresh.payments.length === 1) emails.donationAlert(fresh);
  void invoice;
  return true;
}

/** Handles any Stripe event related to foundation donations. Returns true if the event was a donation event. */
export async function handleDonationEvent(event) {
  const obj = event.data.object;
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      if (obj.metadata?.kind !== "donation") return false;
      const d = await Donation.findOne({ _id: obj.metadata.donationId, stripeSessionId: obj.id });
      if (!d) return true;
      const cd = obj.customer_details || {};
      d.donor = { ...(d.donor?.toObject?.() || d.donor || {}), email: d.donor?.email || cd.email, name: d.donor?.name || cd.name, ...(cd.address?.line1 ? { address: cd.address } : {}) };
      d.stripeCustomerId = typeof obj.customer === "string" ? obj.customer : obj.customer?.id;
      if (obj.mode === "subscription") {
        d.stripeSubscriptionId = typeof obj.subscription === "string" ? obj.subscription : obj.subscription?.id;
        if (d.status === "pending") d.status = "active";
        await d.save();
      } else if (obj.payment_status === "paid") {
        d.stripePaymentIntent = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id;
        if (d.status === "pending") d.status = "paid";
        await d.save();
        await recordPayment(d, { key: `cs:${obj.id}`, amount: cents((obj.amount_total ?? d.total * 100) / 100), paymentIntent: d.stripePaymentIntent });
      }
      return true;
    }
    case "checkout.session.expired": {
      if (obj.metadata?.kind !== "donation") return false;
      await Donation.updateOne({ stripeSessionId: obj.id, status: "pending" }, { $set: { status: "cancelled" } });
      return true;
    }
    case "invoice.paid":
    case "invoice.payment_succeeded": {
      const subId = subIdOf(obj); const meta = metaOf(obj);
      if (!subId && meta.kind !== "donation") return false;
      let d = subId ? await Donation.findOne({ stripeSubscriptionId: subId }) : null;
      if (!d && meta.donationId) d = await Donation.findById(meta.donationId);
      if (!d) return meta.kind === "donation";
      if (!d.stripeSubscriptionId && subId) d.stripeSubscriptionId = subId;
      if (["pending", "failed"].includes(d.status)) d.status = "active";
      await d.save();
      const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id;
      await recordPayment(d, { key: `in:${obj.id}`, amount: cents((obj.amount_paid ?? 0) / 100), paymentIntent: pi, invoice: obj.id });
      return true;
    }
    case "invoice.payment_failed": {
      const subId = subIdOf(obj); if (!subId) return false;
      const r = await Donation.updateOne({ stripeSubscriptionId: subId, status: "active" }, { $set: { status: "failed" } });
      return r.matchedCount > 0;
    }
    case "customer.subscription.deleted": {
      const r = await Donation.updateOne({ stripeSubscriptionId: obj.id, status: { $ne: "cancelled" } }, { $set: { status: "cancelled", cancelledAt: new Date() } });
      return r.matchedCount > 0;
    }
    case "charge.refunded": {
      const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id;
      if (!pi || !obj.refunded) return false;
      const r = await Donation.updateOne({ stripePaymentIntent: pi, frequency: "one-time" }, { $set: { status: "refunded" } });
      return r.matchedCount > 0;
    }
  }
  return false;
}
