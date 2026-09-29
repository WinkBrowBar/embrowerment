import { Router } from "express";
import { Product } from "../models/Product.js";
import { Course } from "../models/Course.js";
import { notFound, forbidden, escapeRegex } from "../lib/http.js";
import { requireUser } from "../middleware/auth.js";

const r = Router();

const productOut = (p) => ({
  id: p._id, name: p.name, slug: p.slug, tagline: p.tagline, description: p.description, price: p.price, compareAtPrice: p.compareAtPrice,
  category: p.category, images: p.images, variantLabel: p.variantLabel, sections: p.sections, featured: p.featured, comingSoon: !!p.comingSoon,
  variants: p.variants.map(v => ({ name: v.name, inStock: !p.trackInventory || v.stock > 0 })),
  inStock: !p.comingSoon && (!p.trackInventory || (p.variants.length ? p.variants.some(v => v.stock > 0) : p.stock > 0)),
});

const courseOut = (c, owns = false) => ({
  id: c._id, title: c.title, slug: c.slug, summary: c.summary, description: c.description, price: c.price, image: c.image, points: c.points, owned: owns, purchaseUrl: c.purchaseUrl || "", comingSoon: !!c.comingSoon,
  lessonCount: c.lessons.length, totalMinutes: c.lessons.reduce((n, l) => n + (l.durationMin || 0), 0),
  lessons: c.lessons.map(l => ({ id: l._id, title: l.title, durationMin: l.durationMin, preview: l.preview, ...(owns || l.preview ? { videoUrl: l.videoUrl, content: l.content } : {}) })),
});

const owns = (user, course) => !!user && (user.role === "admin" || user.courses.some(c => String(c.course) === String(course._id)));

r.get("/products", async (req, res) => {
  const q = { active: true };
  if (req.query.category) q.category = String(req.query.category);
  if (req.query.q) q.name = { $regex: escapeRegex(String(req.query.q)), $options: "i" };
  const list = await Product.find(q).sort({ sort: 1, createdAt: -1 });
  const categories = await Product.distinct("category", { active: true });
  res.json({ products: list.map(productOut), categories });
});

r.get("/products/:slug", async (req, res) => {
  const p = await Product.findOne({ slug: req.params.slug, active: true });
  if (!p) throw notFound("Product not found");
  const related = await Product.find({ active: true, _id: { $ne: p._id }, category: p.category }).limit(4);
  res.json({ product: productOut(p), related: related.map(productOut) });
});

r.get("/courses", async (req, res) => {
  const list = await Course.find({ active: true }).sort({ sort: 1, createdAt: -1 });
  res.json({ courses: list.map(c => courseOut(c, owns(req.user, c))) });
});

r.get("/courses/:slug", async (req, res) => {
  const c = await Course.findOne({ slug: req.params.slug, active: true });
  if (!c) throw notFound("Course not found");
  res.json({ course: courseOut(c, owns(req.user, c)) });
});

/** Full lesson content for owners. */
r.get("/courses/:slug/learn", requireUser, async (req, res) => {
  const c = await Course.findOne({ slug: req.params.slug });
  if (!c) throw notFound("Course not found");
  if (!owns(req.user, c)) throw forbidden("Purchase this course to watch it");
  res.json({ course: courseOut(c, true) });
});

export default r;
export { productOut, courseOut };