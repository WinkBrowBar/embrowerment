/* Demo data: customers, orders across the last 30 days, coupons, wishlist and course access.
   Run after `npm run seed`. Re-running removes and recreates only the demo records (emails ending @demo.embrowerment.com). */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { connectDb } from "./lib/db.js";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Course } from "./models/Course.js";
import { Coupon } from "./models/Coupon.js";
import { Order, nextOrderNumber } from "./models/Order.js";

export const DEMO_PASSWORD = "Demo1234!";
const DOMAIN = "@demo.embrowerment.com";
const day = (n) => new Date(Date.now() - n * 864e5 - Math.floor(Math.random() * 8) * 36e5);
const addr = (name, line1, city, state, postal_code) => ({ name, line1, city, state, postal_code, country: "US" });

await connectDb();
const products = await Product.find().sort({ sort: 1 });
const courses = await Course.find().sort({ sort: 1 });
if (!products.length || !courses.length) { console.error("Run `npm run seed` first."); process.exit(1); }
const P = Object.fromEntries(products.map(p => [p.slug, p]));
const C = Object.fromEntries(courses.map(c => [c.slug, c]));

// Clean previous demo data
const old = await User.find({ email: { $regex: `${DOMAIN.replace(/\./g, "\\.")}$` } }, "_id");
await Order.deleteMany({ user: { $in: old.map(u => u._id) } });
await User.deleteMany({ _id: { $in: old.map(u => u._id) } });

const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
const people = [
  ["Sofia Rahman", "sofia", addr("Sofia Rahman", "20 W 57th St, Apt 5B", "New York", "NY", "10019")],
  ["Maya Chen", "maya", addr("Maya Chen", "118 Bedford Ave", "Brooklyn", "NY", "11249")],
  ["Olivia Brooks", "olivia", addr("Olivia Brooks", "44 Mercer St", "Jersey City", "NJ", "07302")],
  ["Priya Nair", "priya", addr("Priya Nair", "2201 Wilshire Blvd", "Los Angeles", "CA", "90057")],
  ["Hannah Lee", "hannah", addr("Hannah Lee", "9 Newbury St", "Boston", "MA", "02116")],
];
const users = {};
for (const [name, key] of people) users[key] = await User.create({ name, email: `${key}${DOMAIN}`, passwordHash: hash, lastLoginAt: day(Math.floor(Math.random() * 10)) });

const line = (slug, qty = 1, variant = "") => { const p = P[slug]; return { kind: "product", ref: p._id, name: p.name, variant, image: p.images[0], price: p.price, qty }; };
const course = (slug) => { const c = C[slug]; return { kind: "course", ref: c._id, name: c.title, variant: "", image: c.image, price: c.price, qty: 1 }; };

async function order(key, items, { daysAgo, status, coupon, tracking }) {
  const u = users[key]; const a = people.find(p => p[1] === key)[2];
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const discount = coupon ? Math.round((coupon.type === "percent" ? subtotal * coupon.value / 100 : Math.min(coupon.value, subtotal)) * 100) / 100 : 0;
  const physical = items.some(i => i.kind === "product");
  const productTotal = items.filter(i => i.kind === "product").reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = physical && productTotal - discount < 100 ? 8 : 0;
  const total = Math.round((subtotal - discount + shipping) * 100) / 100;
  const at = day(daysAgo);
  const history = [{ status: "pending", note: "Checkout started", at }, { status: "paid", note: "Payment received via Stripe", at }];
  if (["processing", "shipped", "delivered"].includes(status) && physical) history.push({ status: "processing", note: "Packed", at: new Date(+at + 864e5) });
  if (["shipped", "delivered"].includes(status) && physical) history.push({ status: "shipped", note: "Shipped via UPS", at: new Date(+at + 2 * 864e5) });
  if (status === "delivered") history.push({ status: "delivered", note: physical ? "Delivered" : "Digital order — courses unlocked", at: new Date(+at + (physical ? 4 : 0) * 864e5) });
  if (status === "refunded") history.push({ status: "refunded", note: "Refunded — customer request", at: new Date(+at + 3 * 864e5) });
  const o = await Order.create({
    number: await nextOrderNumber(), user: u._id, email: u.email, items, subtotal, discount, shipping, tax: 0, total,
    coupon: coupon ? { code: coupon.code, type: coupon.type, value: coupon.value } : undefined,
    status, requiresShipping: physical, shippingAddress: physical ? a : undefined, phone: "+1 646 555 01" + String(10 + Object.keys(users).indexOf(key)),
    trackingNumber: tracking, stripeSessionId: `cs_demo_${Math.random().toString(36).slice(2)}`, stripePaymentIntent: `pi_demo_${Math.random().toString(36).slice(2)}`,
    paidAt: at, fulfilledAt: at, effects: ["demo"], history, createdAt: at, updatedAt: at,
  });
  for (const i of items) if (i.kind === "course" && status !== "refunded" && !u.courses.some(c => String(c.course) === String(i.ref))) u.courses.push({ course: i.ref, order: o._id, grantedAt: at });
  if (coupon) await Coupon.updateOne({ code: coupon.code }, { $inc: { usedCount: 1 } });
  return o;
}

// Coupons
const coupons = [
  { code: "SPRING20", type: "percent", value: 20, description: "20% off everything", expiresAt: new Date(Date.now() + 60 * 864e5) },
  { code: "BROWS15", type: "percent", value: 15, appliesTo: "products", description: "15% off products", minSubtotal: 50 },
  { code: "ACADEMY10", type: "fixed", value: 10, appliesTo: "courses", description: "$10 off any course" },
  { code: "VIP50", type: "fixed", value: 50, minSubtotal: 150, maxUses: 20, description: "$50 off orders over $150" },
  { code: "SUMMER25", type: "percent", value: 25, description: "Summer sale (ended)", expiresAt: new Date(Date.now() - 20 * 864e5) },
];
for (const c of coupons) await Coupon.updateOne({ code: c.code }, { $setOnInsert: c }, { upsert: true });
const cp = Object.fromEntries((await Coupon.find()).map(c => [c.code, c]));

// Orders (spread across the last 30 days)
await order("sofia", [line("embrowerment-precision-pencil", 2, "Dark Brown"), line("power-brow-styling-wax")], { daysAgo: 27, status: "delivered", tracking: "1Z999AA10123456784" });
await order("sofia", [course("90-second-brow"), course("brow-mapping")], { daysAgo: 12, status: "delivered", coupon: cp.ACADEMY10 });
await order("sofia", [line("pure-hyaluronic-serum"), line("eye-rise-serum")], { daysAgo: 2, status: "shipped", tracking: "1Z999AA10123456791" });
await order("maya", [line("pro-essentials-kit"), line("embrowerment-mechanical-sculpting-pencil", 1, "Dark Coffee")], { daysAgo: 21, status: "delivered", coupon: cp.SPRING20, tracking: "1Z999AA10123456802" });
await order("maya", [course("upper-lip-threading")], { daysAgo: 6, status: "delivered" });
await order("olivia", [line("zen-eye-face-cream"), line("face-brush")], { daysAgo: 17, status: "delivered", tracking: "1Z999AA10123456815" });
await order("olivia", [line("pure-hyaluronic-serum", 2)], { daysAgo: 9, status: "refunded" });
await order("priya", [line("pro-essentials-kit", 2), course("brow-filling"), line("embrowerment-precision-pencil", 3, "Dark Gray")], { daysAgo: 4, status: "processing", coupon: cp.VIP50 });
await order("priya", [line("power-brow-styling-wax", 2)], { daysAgo: 1, status: "paid" });
await order("hannah", [line("embrowerment-precision-pencil", 1, "Light Brown"), line("embrowerment-mechanical-sculpting-pencil", 1, "Light Brown")], { daysAgo: 14, status: "delivered", coupon: cp.BROWS15, tracking: "1Z999AA10123456828" });
await order("hannah", [course("90-second-brow")], { daysAgo: 0, status: "delivered" });

// Wishlists + carts
users.sofia.wishlist = [{ kind: "product", ref: P["zen-eye-face-cream"]._id }, { kind: "product", ref: P["face-brush"]._id }, { kind: "course", ref: C["upper-lip-threading"]._id }];
users.sofia.cart = [{ kind: "product", ref: P["embrowerment-precision-pencil"]._id, variant: "Dark Coffee", qty: 1 }];
users.maya.wishlist = [{ kind: "product", ref: P["pure-hyaluronic-serum"]._id }];
for (const u of Object.values(users)) await u.save();

// Make the admin dashboard's low-stock panel meaningful
await Product.updateOne({ slug: "face-brush" }, { $set: { stock: 3 } });
const pencil = await Product.findOne({ slug: "embrowerment-precision-pencil" });
if (pencil) { const i = pencil.variants.findIndex(v => v.name === "Dark Gray"); if (i >= 0) await Product.updateOne({ _id: pencil._id }, { $set: { [`variants.${i}.stock`]: 2 } }); }

console.log(`✓ ${people.length} demo customers, ${await Order.countDocuments({ user: { $in: Object.values(users).map(u => u._id) } })} orders, ${coupons.length} coupons`);
console.log(`\nDemo customer login:\n  email:    sofia${DOMAIN}\n  password: ${DEMO_PASSWORD}\n(all demo customers use the same password: ${people.map(p => p[1] + DOMAIN).join(", ")})`);
await mongoose.disconnect();
