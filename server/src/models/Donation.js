import mongoose from "mongoose";

export const DONATION_STATUSES = ["pending", "paid", "active", "cancelled", "failed", "refunded"];

const donationSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },       // FND-100001
  designation: { key: String, label: String },
  frequency: { type: String, enum: ["one-time", "monthly", "quarterly", "annual"], default: "one-time" },
  amount: { type: Number, required: true },                      // gift amount (USD)
  fee: { type: Number, default: 0 },                             // covered processing fee
  total: { type: Number, required: true },                       // charged per donation
  coverFee: { type: Boolean, default: false },
  currency: { type: String, default: "usd" },
  donor: { name: String, email: String, phone: String, address: { line1: String, line2: String, city: String, state: String, postal_code: String, country: String } },
  anonymous: { type: Boolean, default: false },
  note: String,
  status: { type: String, enum: DONATION_STATUSES, default: "pending" },
  stripeAccount: { type: String, enum: ["store", "foundation"], default: "store" },
  stripeSessionId: { type: String, index: true },
  stripePaymentIntent: String,
  stripeSubscriptionId: { type: String, index: true },
  stripeCustomerId: String,
  payments: [{ at: Date, amount: Number, invoice: String, paymentIntent: String, _id: false }],   // each successful charge (recurring = many)
  totalReceived: { type: Number, default: 0 },
  receiptSentAt: Date,
  source: { type: String, default: "" },                          // referrer / origin
  cancelledAt: Date,
}, { timestamps: true });

export const Donation = mongoose.model("Donation", donationSchema);

const counterSchema = new mongoose.Schema({ _id: String, seq: Number });
const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export async function nextDonationNumber() {
  const c = await Counter.findOneAndUpdate({ _id: "donation" }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return `FND-${100000 + c.seq}`;
}
