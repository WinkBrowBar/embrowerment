import mongoose from "mongoose";

export const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

const orderSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  items: [{
    kind: { type: String, enum: ["product", "course"], required: true },
    ref: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String, variant: String, image: String,
    price: Number, qty: Number, _id: false,
  }],
  subtotal: Number, discount: { type: Number, default: 0 }, shipping: { type: Number, default: 0 }, tax: { type: Number, default: 0 }, total: Number,
  currency: { type: String, default: "usd" },
  coupon: { code: String, type: { type: String }, value: Number },
  status: { type: String, enum: ORDER_STATUSES, default: "pending" },
  requiresShipping: { type: Boolean, default: false },
  shippingAddress: { name: String, line1: String, line2: String, city: String, state: String, postal_code: String, country: String },
  phone: String,
  trackingNumber: String,
  stripeSessionId: { type: String, index: true },
  stripePaymentIntent: String,
  paidAt: Date,
  fulfilledAt: Date,
  effects: { type: [String], default: [] },   // completed fulfilment steps (idempotency)
  notes: String,
  history: [{ status: String, note: String, at: { type: Date, default: Date.now }, _id: false }],
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);

const counterSchema = new mongoose.Schema({ _id: String, seq: Number });
const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export async function nextOrderNumber() {
  const c = await Counter.findOneAndUpdate({ _id: "order" }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return `EMB-${100000 + c.seq}`;
}
