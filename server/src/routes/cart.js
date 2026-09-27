import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { parse, bad } from "../lib/http.js";
import { quote } from "../lib/pricing.js";
import { requireUser } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Course } from "../models/Course.js";
import { productOut, courseOut } from "./catalog.js";

const r = Router();
const line = z.object({ kind: z.enum(["product", "course"]), ref: z.string().refine(mongoose.isValidObjectId, "Invalid id"), variant: z.string().max(80).optional().default(""), qty: z.coerce.number().int().min(1).max(99).default(1) });
const lines = z.array(line).max(50);

/** Price any cart (works for guests). Body: { items, coupon } */
r.post("/cart/quote", async (req, res) => {
  const b = parse(z.object({ items: lines, coupon: z.string().trim().max(40).optional() }), req.body);
  res.json(await quote(b.items, { couponCode: b.coupon, user: req.user }));
});

/** Logged-in cart persistence. */
r.get("/cart", requireUser, async (req, res) => {
  res.json({ items: req.user.cart.map(l => ({ kind: l.kind, ref: String(l.ref), variant: l.variant, qty: l.qty })) });
});
r.put("/cart", requireUser, async (req, res) => {
  const b = parse(z.object({ items: lines }), req.body);
  req.user.cart = b.items; await req.user.save();
  res.json({ items: b.items });
});
/** Merge a guest cart into the account cart on login. */
r.post("/cart/merge", requireUser, async (req, res) => {
  const b = parse(z.object({ items: lines }), req.body);
  const key = (l) => `${l.kind}:${l.ref}:${l.variant || ""}`;
  const map = new Map(req.user.cart.map(l => [key(l), { kind: l.kind, ref: String(l.ref), variant: l.variant, qty: l.qty }]));
  for (const l of b.items) {
    const k = key(l); const cur = map.get(k);
    map.set(k, cur ? { ...cur, qty: l.kind === "course" ? 1 : Math.min(99, cur.qty + l.qty) } : l);
  }
  req.user.cart = [...map.values()]; await req.user.save();
  res.json({ items: req.user.cart.map(l => ({ kind: l.kind, ref: String(l.ref), variant: l.variant, qty: l.qty })) });
});

/** Wishlist */
r.get("/wishlist", requireUser, async (req, res) => {
  const pIds = req.user.wishlist.filter(w => w.kind === "product").map(w => w.ref);
  const cIds = req.user.wishlist.filter(w => w.kind === "course").map(w => w.ref);
  const [products, courses] = await Promise.all([Product.find({ _id: { $in: pIds }, active: true }), Course.find({ _id: { $in: cIds }, active: true })]);
  res.json({ ids: req.user.wishlist.map(w => `${w.kind}:${w.ref}`), products: products.map(productOut), courses: courses.map(c => courseOut(c, false)) });
});
r.post("/wishlist/toggle", requireUser, async (req, res) => {
  const b = parse(z.object({ kind: z.enum(["product", "course"]), ref: z.string().refine(mongoose.isValidObjectId, "Invalid id") }), req.body);
  const Model = b.kind === "product" ? Product : Course;
  if (!(await Model.exists({ _id: b.ref }))) throw bad("Item not found");
  const i = req.user.wishlist.findIndex(w => w.kind === b.kind && String(w.ref) === b.ref);
  if (i >= 0) req.user.wishlist.splice(i, 1); else req.user.wishlist.push({ kind: b.kind, ref: b.ref });
  await req.user.save();
  res.json({ saved: i < 0, ids: req.user.wishlist.map(w => `${w.kind}:${w.ref}`) });
});

export default r;
