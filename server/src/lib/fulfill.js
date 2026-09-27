import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { User } from "../models/User.js";
import { emails } from "./mailer.js";

/** Runs `fn` at most once per order+key. If fn throws, the claim is released so a retry can run it. */
async function once(orderId, key, fn) {
  const claimed = await Order.updateOne({ _id: orderId, effects: { $ne: key } }, { $addToSet: { effects: key } });
  if (!claimed.modifiedCount) return;
  try { await fn(); } catch (e) { await Order.updateOne({ _id: orderId }, { $pull: { effects: key } }); throw e; }
}

async function decrementStock(item) {
  const p = await Product.findById(item.ref);
  if (!p?.trackInventory) return;
  if (!p.variants.length) return Product.updateOne({ _id: p._id }, { $inc: { stock: -item.qty } });
  const idx = p.variants.findIndex(v => v.name === item.variant);
  if (idx < 0) return;
  // Index-based path (portable across MongoDB-compatible servers); guarded by the variant name.
  await Product.updateOne({ _id: p._id, [`variants.${idx}.name`]: item.variant }, { $inc: { [`variants.${idx}.stock`]: -item.qty } });
}

/**
 * Marks an order paid and applies its effects exactly once:
 * decrements stock, counts coupon use, grants courses, clears the cart, sends emails.
 * Safe to call repeatedly and concurrently (webhook + success page + Stripe retries).
 */
export async function fulfillOrder(orderId, { paymentIntent, shipping, phone } = {}) {
  await Order.updateOne(
    { _id: orderId, paidAt: null },
    { $set: { paidAt: new Date(), status: "paid", ...(paymentIntent && { stripePaymentIntent: paymentIntent }), ...(shipping && { shippingAddress: shipping }), ...(phone && { phone }) },
      $push: { history: { status: "paid", note: "Payment received via Stripe" } } },
  );
  let order = await Order.findById(orderId);
  if (!order || order.fulfilledAt) return order;

  for (const [i, item] of order.items.entries()) if (item.kind === "product") await once(order._id, `stock:${i}`, () => decrementStock(item));
  if (order.coupon?.code) await once(order._id, "coupon", () => Coupon.updateOne({ code: order.coupon.code }, { $inc: { usedCount: 1 } }));
  await once(order._id, "user", async () => {
    const user = await User.findById(order.user); if (!user) return;
    const have = new Set(user.courses.map(c => String(c.course)));
    for (const it of order.items) if (it.kind === "course" && !have.has(String(it.ref))) user.courses.push({ course: it.ref, order: order._id });
    user.cart = []; await user.save();
  });

  const digitalOnly = !order.requiresShipping;
  order = await Order.findOneAndUpdate({ _id: order._id, fulfilledAt: null }, {
    $set: { fulfilledAt: new Date(), ...(digitalOnly && { status: "delivered" }) },
    ...(digitalOnly && { $push: { history: { status: "delivered", note: "Digital order — courses unlocked" } } }),
  }, { returnDocument: "after" }) || await Order.findById(order._id);
  await once(order._id, "email", async () => { emails.orderConfirmed(order); emails.adminNewOrder(order); });
  return order;
}
