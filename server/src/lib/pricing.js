import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Course } from "../models/Course.js";
import { Coupon } from "../models/Coupon.js";
import { Order } from "../models/Order.js";
import { getSettings } from "../models/Setting.js";

const round = (n) => Math.round(n * 100) / 100;

/**
 * Prices a cart from the database (client prices are never trusted).
 * lines: [{ kind, ref, variant, qty }]
 * Returns { items, subtotal, discount, shipping, tax, total, coupon, couponError, requiresShipping, problems }
 */
export async function quote(lines, { couponCode, user } = {}) {
  const valid = (lines || []).filter(l => l && mongoose.isValidObjectId(l.ref) && ["product", "course"].includes(l.kind));
  const pIds = valid.filter(l => l.kind === "product").map(l => l.ref);
  const cIds = valid.filter(l => l.kind === "course").map(l => l.ref);
  const [products, courses] = await Promise.all([Product.find({ _id: { $in: pIds } }), Course.find({ _id: { $in: cIds } })]);
  const owned = new Set((user?.courses || []).map(c => String(c.course)));

  const items = []; const problems = [];
  const seenCourse = new Set();
  for (const l of valid) {
    if (l.kind === "product") {
      const p = products.find(x => String(x._id) === String(l.ref));
      if (!p || !p.active) { problems.push({ ref: l.ref, message: "No longer available" }); continue; }
      const variant = p.variants.length ? (l.variant || p.variants[0].name) : "";
      if (p.variants.length && !p.variants.some(v => v.name === variant)) { problems.push({ ref: l.ref, message: `${p.name}: shade unavailable` }); continue; }
      const qty = Math.max(1, Math.min(99, Number(l.qty) || 1));
      if (!p.available(variant, qty)) { problems.push({ ref: l.ref, variant, message: `${p.name}${variant ? ` (${variant})` : ""} is out of stock` }); }
      items.push({ kind: "product", ref: p._id, slug: p.slug, name: p.name, variant, image: p.images[0] || "", price: p.price, qty, inStock: p.available(variant, qty) });
    } else {
      const c = courses.find(x => String(x._id) === String(l.ref));
      if (!c || !c.active) { problems.push({ ref: l.ref, message: "Course no longer available" }); continue; }
      if (seenCourse.has(String(c._id))) continue; seenCourse.add(String(c._id));
      if (owned.has(String(c._id))) { problems.push({ ref: l.ref, message: `You already own ${c.title}` }); continue; }
      items.push({ kind: "course", ref: c._id, slug: c.slug, name: c.title, variant: "", image: c.image, price: c.price, qty: 1, inStock: true });
    }
  }

  const s = await getSettings();
  const subtotal = round(items.reduce((n, i) => n + i.price * i.qty, 0));
  const productSubtotal = round(items.filter(i => i.kind === "product").reduce((n, i) => n + i.price * i.qty, 0));
  const courseSubtotal = round(subtotal - productSubtotal);
  const requiresShipping = productSubtotal > 0;

  let discount = 0, coupon = null, couponError = null;
  if (couponCode) {
    const r = await validateCoupon(couponCode, { subtotal, productSubtotal, courseSubtotal, user });
    if (r.error) couponError = r.error;
    else { coupon = r.coupon; discount = r.discount; }
  }
  const shipping = requiresShipping && !(s.store.freeShippingOver > 0 && productSubtotal - (coupon?.appliesTo === "courses" ? 0 : discount) >= s.store.freeShippingOver) ? round(s.store.shippingFlat) : 0;
  const tax = round(Math.max(0, subtotal - discount) * (s.store.taxRate || 0) / 100);
  const total = round(Math.max(0, subtotal - discount) + shipping + tax);
  return { items, subtotal, discount, shipping, tax, total, currency: s.store.currency, requiresShipping, problems, couponError,
    coupon: coupon ? { code: coupon.code, type: coupon.type, value: coupon.value, appliesTo: coupon.appliesTo, description: coupon.description } : null };
}

export async function validateCoupon(code, { subtotal, productSubtotal, courseSubtotal, user }) {
  const c = await Coupon.findOne({ code: String(code).trim().toUpperCase() });
  const now = new Date();
  if (!c || !c.active) return { error: "Invalid coupon code" };
  if (c.startsAt && c.startsAt > now) return { error: "This coupon isn't active yet" };
  if (c.expiresAt && c.expiresAt < now) return { error: "This coupon has expired" };
  if (c.maxUses && c.usedCount >= c.maxUses) return { error: "This coupon has reached its usage limit" };
  if (c.minSubtotal && subtotal < c.minSubtotal) return { error: `Spend $${c.minSubtotal.toFixed(2)} or more to use this coupon` };
  if (c.perUserLimit && user) {
    const used = await Order.countDocuments({ user: user._id, "coupon.code": c.code, status: { $nin: ["pending", "cancelled"] } });
    if (used >= c.perUserLimit) return { error: "You've already used this coupon" };
  }
  const base = c.appliesTo === "products" ? productSubtotal : c.appliesTo === "courses" ? courseSubtotal : subtotal;
  if (base <= 0) return { error: `This coupon only applies to ${c.appliesTo}` };
  const discount = round(Math.min(base, c.type === "percent" ? base * c.value / 100 : c.value));
  return { coupon: c, discount };
}
