import mongoose from "mongoose";

const lineSchema = new mongoose.Schema({
  kind: { type: String, enum: ["product", "course"], required: true },
  ref: { type: mongoose.Schema.Types.ObjectId, required: true },
  variant: { type: String, default: "" },
  qty: { type: Number, default: 1, min: 1, max: 99 },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  active: { type: Boolean, default: true },
  cart: { type: [lineSchema], default: [] },
  wishlist: { type: [{ kind: { type: String, enum: ["product", "course"] }, ref: mongoose.Schema.Types.ObjectId, _id: false }], default: [] },
  courses: { type: [{ course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, grantedAt: { type: Date, default: Date.now }, _id: false }], default: [] },
  resetTokenHash: { type: String, select: false },
  resetTokenExp: { type: Date, select: false },
  tokenVersion: { type: Number, default: 0 },
  lastLoginAt: Date,
}, { timestamps: true });

userSchema.methods.toSafe = function () {
  return { id: this._id, name: this.name, email: this.email, role: this.role, createdAt: this.createdAt };
};

export const User = mongoose.model("User", userSchema);
