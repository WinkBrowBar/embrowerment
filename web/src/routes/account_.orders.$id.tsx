import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, money, type Order } from "@/lib/api";
import { SafeImg } from "@/components/site";
import { useRequireUser, statusLabel } from "./account";

export const Route = createFileRoute("/account_/orders/$id")({ head: () => ({ meta: [{ title: "Order — Embrowerment®" }, { name: "robots", content: "noindex" }] }), component: OrderPage });

export function OrderView({ o }: { o: Order }) {
  const a = o.shippingAddress;
  return <div className="order-view">
    <ul className="cart-lines">{o.items.map((i, k) => <li key={k}><span className="cl-img"><SafeImg src={i.image} alt="" /></span><div className="cl-body"><b>{i.name}</b><small>{i.kind === "course" ? "Online course" : i.variant}{i.qty > 1 ? ` · Qty ${i.qty}` : ""}</small>
      {i.kind === "course" && ["paid", "delivered", "processing", "shipped"].includes(o.status) && <Link to="/account" search={{ tab: "courses" }} className="link small">Go to course</Link>}</div><span className="cl-price">{money(i.price * i.qty)}</span></li>)}</ul>
    <dl className="totals"><dt>Subtotal</dt><dd>{money(o.subtotal)}</dd>{o.discount > 0 && <><dt>Discount{o.coupon ? ` (${o.coupon.code})` : ""}</dt><dd>−{money(o.discount)}</dd></>}{o.shipping > 0 && <><dt>Shipping</dt><dd>{money(o.shipping)}</dd></>}{o.tax > 0 && <><dt>Tax</dt><dd>{money(o.tax)}</dd></>}<dt className="t">Total</dt><dd className="t">{money(o.total)}</dd></dl>
    {a?.line1 && <div className="ship"><h3 className="eyebrow">Shipping to</h3><p>{a.name}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />{a.city}, {a.state} {a.postal_code}<br />{a.country}</p>{o.trackingNumber && <p>Tracking: <b>{o.trackingNumber}</b></p>}</div>}
  </div>;
}

function OrderPage() {
  const user = useRequireUser(); const { id } = Route.useParams();
  const [o, setO] = useState<Order | null>(null); const [err, setErr] = useState("");
  useEffect(() => { if (user) api<{ order: Order }>(`/orders/${id}`).then(d => setO(d.order)).catch(e => setErr(e.message)); }, [user, id]);
  return <section className="feat account">
    <nav className="crumbs"><Link to="/account" search={{ tab: "orders" }}>Account</Link> › <span>Order</span></nav>
    {err && <p className="form-error">{err}</p>}
    {o && <><div className="account-head"><h1 className="h-display">Order {o.number}</h1><span className={`status s-${o.status}`}>{statusLabel(o.status)}</span></div><p className="muted-t">Placed {new Date(o.createdAt).toLocaleString()}</p><OrderView o={o} /></>}
  </section>;
}
