import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, default: "" },   // YouTube/Vimeo/MP4 URL — only sent to owners (or if preview)
  durationMin: { type: Number, default: 0 },
  content: { type: String, default: "" },
  preview: { type: Boolean, default: false },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  summary: { type: String, default: "" },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: "" },
  points: { type: [String], default: [] },
  lessons: { type: [lessonSchema], default: [] },
  purchaseUrl: { type: String, default: "" },   // if set, "Purchase" redirects here instead of the cart
  comingSoon: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  sort: { type: Number, default: 0 },
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);