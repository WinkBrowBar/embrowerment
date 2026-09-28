import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  tagline: { type: String, default: "" },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },          // USD, major units
  compareAtPrice: { type: Number, min: 0 },
  category: { type: String, default: "Brows", trim: true },
  images: { type: [String], default: [] },
  variantLabel: { type: String, default: "Shade" },
  variants: { type: [{ name: { type: String, required: true }, sku: String, stock: { type: Number, default: 0 }, _id: false }], default: [] },
  stock: { type: Number, default: 0 },                       // used when there are no variants
  trackInventory: { type: Boolean, default: true },
  sections: { type: [{ title: String, body: String, _id: false }], default: [] }, // accordions on the product page
  featured: { type: Boolean, default: false },
  comingSoon: { type: Boolean, default: false },   // visible but not purchasable
  active: { type: Boolean, default: true },
  sort: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.methods.available = function (variant, qty = 1) {
  if (!this.active || this.comingSoon) return false;
  if (!this.trackInventory) return true;
  if (this.variants.length) {
    const v = this.variants.find(x => x.name === variant);
    return !!v && v.stock >= qty;
  }
  return this.stock >= qty;
};

export const Product = mongoose.model("Product", productSchema);