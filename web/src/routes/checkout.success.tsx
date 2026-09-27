import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { api, type Order } from "@/lib/api";
import { useStore } from "@/components/site";
import { OrderView } from "./account_.orders.$id";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s: Record<string, unknown>) => ({ session_id: typeof s["session_id"] === "string" ? s["session_id"] : "" }),
  head: () => ({ meta: [{ title: "Thank you — Embrowerment®" }, { name: "robots", content: "noindex" }] }),
  component: Success,
});

function Success() {
  const { session_id } = Route.useSearch(); const { user, ready, clear } = useStore();
  const [o, setO] = useState<Order | null>(null); const [err, setErr] = useState("");
  const started = useRef(false);
  useEffect(() => {
    if (!ready || !user || !session_id || started.current) return;
    started.current = true;
    let tries = 0; let t: ReturnType<typeof setTimeout>;
    const poll = () => api<{ order: Order }>(`/checkout/session/${session_id}`).then(d => {
      setO(d.order);
      if (d.order.status === "pending" && ++tries < 10) t = setTimeout(poll, 2000); else if (d.order.status !== "pending") clear();
    }).catch(e => setErr(e.message));
    poll(); return () => clearTimeout(t);
  }, [ready, user, session_id]); // eslint-disable-line react-hooks/exhaustive-deps
  const pending = o?.status === "pending";
  return <section className="feat account">
    <span className="eyebrow">Checkout</span>
    <h1 className="h-display">{err ? "We couldn't find that order" : pending || !o ? "Confirming your payment…" : "Thank you."}</h1>
    {err && <p className="lede">{err}. If you were charged, please contact the concierge at hello@embrowerment.com.</p>}
    {o && !pending && <p className="lede">Order <b>{o.number}</b> is confirmed. A receipt is on its way to your inbox.{o.items.some(i => i.kind === "course") ? " Your courses are ready in your account." : ""}</p>}
    {o && <OrderView o={o} />}
    <div className="row"><Link to="/account" search={{ tab: o?.items.some(i => i.kind === "course") ? "courses" : "orders" }} className="btn-solid">Go to your account</Link><Link to="/shop" className="btn-mono">Continue shopping</Link></div>
  </section>;
}
