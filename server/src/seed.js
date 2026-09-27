/* Seeds the admin account, catalog, courses and a sample coupon. Safe to re-run: existing records (matched by slug/code/email) are left untouched. */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { connectDb } from "./lib/db.js";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Course } from "./models/Course.js";
import { Coupon } from "./models/Coupon.js";
import { getSettings } from "./models/Setting.js";

// Product & course images hosted on the embrowerment.com Squarespace CDN (no local files needed).
const SQ = "https://static1.squarespace.com/static/6a690a8ed11914133e560950/6a690c265e3cb611c662dad5";
const CDN = {
  kit: `${SQ}/6a690c265e3cb611c662db07/1790273909515/Embrowerment+Pro+Precision+kit.jpg?format=1500w`,
  "pure-hyaluronic-serum": `${SQ}/6ab5416644aea31d23e0cd93/1790263987956/Pure+Hyaluronic+Serum+-+01.jpg?format=1500w`,
  "eye-rise-serum": `${SQ}/6ab53490ae14e00b87ad8bd8/1790260703499/Eye+Rise+Serum+-+01.jpg?format=1500w`,
  "zen-cream": `${SQ}/6ab53347d5e67563c3b66438/1790260333857/Zen+Eye+%2B+Face+Cream+-+01.jpg?format=1500w`,
  "sculpting-pencil": `${SQ}/6ab536db2efa7c342b304804/1790261626503/Embrowerment+Mechanical+Sculpting+Pencil.jpg?format=1500w`,
  "precision-pencil": `${SQ}/6ab5399e44aea31d23e0c420/1790261937878/Embrowerment+Mechanical+Precision+Pencil.jpg?format=1500w`,
  "brow-wax": `${SQ}/6ab5369eae14e00b87ad8de6/1790260894976/Power+Brow+Styling+Wax.jpg?format=1500w`,
  "face-brush": `${SQ}/6ab53d41ae14e00b87ad95d6/1790264755680/Face+Brush.jpg?format=1500w`,
  academy: "https://images.squarespace-cdn.com/content/v1/635062e6a6b96b67e85bd255/b142a5ef-6bf0-424c-9a5c-d6accd03e6f2/Stocksy_comp_2879811%2B%281%29%2B1-min+%281%29.jpg?format=1000w",
  "products-2": "https://images.squarespace-cdn.com/content/v1/635062e6a6b96b67e85bd255/38146d39-0b99-44c3-b5af-8fe1f06d7223/Stocksy_comp_3990213-min.jpg?format=1000w",
  "products-1": "https://images.squarespace-cdn.com/content/v1/635062e6a6b96b67e85bd255/c7c01795-ff47-4bf5-be2d-d7752fbb7f8f/Stocksy_comp_4338103-min.jpg?format=1000w",
  method: "https://images.squarespace-cdn.com/content/v1/635062e6a6b96b67e85bd255/be3dbf2b-31a2-4462-9427-a40ed2be2f6f/Stocksy_comp_3880512-min.jpg?format=1000w",
};
const img = (f) => CDN[f] || `${config.apiUrl}/uploads/seed/${f}.webp`;
const shades = (stock = 25) => ["Light Brown", "Dark Brown", "Dark Coffee", "Dark Gray"].map(name => ({ name, sku: "", stock }));

const products = [
  { name: "Pro Embrowerment® Essentials Kit", slug: "pro-essentials-kit", price: 80, category: "Tools", images: [img("kit")], stock: 40, featured: true,
    tagline: "For Professionals who desire Precision Artistry",
    description: "Gold-finish precision tweezers, brow scissors, a mapping tool and a dual-ended spoolie — the instruments of the Embrowerment® Method, in one kit." ,
    sections: [{ title: "What's inside", body: "Precision tweezers\nBrow scissors\nBrow mapping tool\nDual-ended spoolie" }] },
  { name: "Pure Hyaluronic Serum", slug: "pure-hyaluronic-serum", price: 68, category: "Skin", images: [img("pure-hyaluronic-serum")], stock: 60,
    tagline: "Hydrating Concentrate",
    description: "Elevate your skincare routine with the Pure Hyaluronic Serum. This potent formula stimulates cell regeneration, provides multi-level hydration, and instantly reduces the appearance of fine lines and wrinkles. Delivers moisture deep into the skin for intense hydration and promotes cell renewal for a youthful complexion." },
  { name: "Eye Rise Serum", slug: "eye-rise-serum", price: 68, category: "Skin", images: [img("eye-rise-serum")], stock: 60,
    tagline: "Brightening + Priming",
    description: "Brighten tired, puffy and aging eyes instantly with a lightweight yet powerful formula with a patented tightening and lifting peptide, designed to reduce puffiness, smooth fine lines, and hydrate the delicate skin around the eyes. A unique 2-in-1 formula: wear alone for a fresh, luminous look or beneath makeup." },
  { name: "Zen Eye + Face Cream", slug: "zen-eye-face-cream", price: 78, category: "Skin", images: [img("zen-cream")], stock: 60,
    tagline: "Microbiome + Peptide Renewal",
    description: "A deeply soothing, ultra-hydrating moisturizer for all skin types — especially sensitive skin, rosacea and eczema. Anti-inflammatory botanicals strengthen the skin barrier, reduce redness and calm irritation, while slow-release technology provides lightweight, long-lasting hydration." },
  { name: "Embrowerment® Mechanical Sculpting Pencil", slug: "embrowerment-mechanical-sculpting-pencil", price: 38, category: "Brows", images: [img("sculpting-pencil")], variants: shades(),
    tagline: "Smooth Gliding + Long-Lasting",
    description: "Sculpt and shape your brows effortlessly with the Embrowerment® Sculpting Pencil. A triangular tip moves from thin lines to broad strokes, and the creamy formula builds bold or natural looks without harsh lines. Dual-ended with a spoolie for shaping and grooming." },
  { name: "Embrowerment® Precision Pencil", slug: "embrowerment-precision-pencil", price: 35, category: "Brows", images: [img("precision-pencil")], variants: shades(), featured: true,
    tagline: "Ultra-Fine Hair-Stroke Tip",
    description: "Achieve perfectly defined brows with precise application, mimicking natural hair strokes for a fuller, more polished look. The companion to the Sculpting Pencil — the same user-friendly design, with a precise tip applicator designed for hairlike stroke application." },
  { name: "Power Brow Styling Wax", slug: "power-brow-styling-wax", price: 27, category: "Brows", images: [img("brow-wax")], stock: 80,
    tagline: "Extreme Hold For Sculpted Brows",
    description: "Keep your brows flawlessly in place. A flake-free formula delivers a mess-free, extreme hold that sculpts and tames your brows all day long." },
  { name: "Face Brush", slug: "face-brush", price: 50, category: "Tools", images: [img("face-brush")], stock: 30,
    tagline: "Microcirculation + Detoxification",
    description: "Ultra-soft bristles won't tug on skin for gentle use on the sensitive eye-zone. Also contours and sculpts jaw, neck and cheekbones. Encourages circulation and cellular waste clearance." },
].map((p, i) => ({ sort: i, ...p }));

const courses = [
  { title: "90 Second Brow", slug: "90-second-brow", price: 60, image: img("academy"), points: ["1 video"], summary: "The fastest everyday brow routine.", lessons: [{ title: "90 Second Brow", videoUrl: "", durationMin: 2 }] },
  { title: "Upper Lip Threading", slug: "upper-lip-threading", price: 50, image: img("products-2"), points: [], summary: "", lessons: [{ title: "Lesson 1", videoUrl: "", durationMin: 0 }] },
  { title: "Brow Mapping", slug: "brow-mapping", price: 20, image: img("products-1"), points: [], summary: "", lessons: [{ title: "Lesson 1", videoUrl: "", durationMin: 0 }] },
  { title: "Brow Filling", slug: "brow-filling", price: 20, image: img("method"), points: [], summary: "", lessons: [{ title: "Lesson 1", videoUrl: "", durationMin: 0 }] },
].map((c, i) => ({ sort: i, ...c }));

await connectDb();
await getSettings();

if (config.adminEmail && config.adminPassword) {
  const email = config.adminEmail.toLowerCase();
  const existing = await User.findOne({ email });
  if (!existing) { await User.create({ name: "Admin", email, role: "admin", passwordHash: await bcrypt.hash(config.adminPassword, 12) }); console.log(`✓ admin ${email}`); }
  else if (existing.role !== "admin") { existing.role = "admin"; await existing.save(); console.log(`✓ promoted ${email} to admin`); }
}
for (const p of products) {
  const cur = await Product.findOne({ slug: p.slug });
  if (!cur) { await Product.create(p); console.log(`✓ product ${p.name}`); }
  else if (!cur.images.length || cur.images.some(u => u.includes("/uploads/seed/"))) { cur.images = p.images; await cur.save(); console.log(`↻ image updated: ${p.name}`); }
}
for (const c of courses) {
  const cur = await Course.findOne({ slug: c.slug });
  if (!cur) { await Course.create(c); console.log(`✓ course ${c.title}`); }
  else if (!cur.image || cur.image.includes("/uploads/seed/")) { cur.image = c.image; await cur.save(); console.log(`↻ image updated: ${c.title}`); }
}
if (!(await Coupon.exists({ code: "WELCOME10" }))) { await Coupon.create({ code: "WELCOME10", type: "percent", value: 10, description: "10% off your first order", perUserLimit: 1 }); console.log("✓ coupon WELCOME10"); }
await mongoose.disconnect();
console.log("Seed complete.");
