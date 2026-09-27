import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  site: { type: String, default: "foundation" },
  name: { type: String, required: true },
  organization: String,
  email: { type: String, required: true },
  phone: String,
  reason: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["new", "read", "replied", "archived", "spam"], default: "new" },
  notes: String,
  ip: String,
  userAgent: String,
}, { timestamps: true });

export const ContactMessage = mongoose.model("ContactMessage", contactSchema);
