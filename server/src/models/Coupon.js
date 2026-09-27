import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["percent", "fixed"], required: true },
  value: { type: Number, required: true, min: 0 },
  appliesTo: { type: String, enum: ["all", "products", "courses"], default: "all" },
  minSubtotal: { type: Number, default: 0 },
  maxUses: { type: Number, default: 0 },       // 0 = unlimited
  perUserLimit: { type: Number, default: 0 },  // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  startsAt: Date,
  expiresAt: Date,
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Coupon = mongoose.model("Coupon", couponSchema);
