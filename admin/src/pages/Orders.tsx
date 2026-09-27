import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api, money, date } from "../api";
import { Page, Badge, useLoad, Empty, Field, toast } from "../components/ui";

const STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled", "refunded", "pending"];

export function Orders() {
  const [sp, setSp] = useSearchParams();
  const status = sp.get("status") || ""; const q = sp.get("q") || ""; const pageN = Number(sp.get("page") || 1);
  const { data, error } = useLoad(() => api(`/admin/orders?${new URLSearchParams({ ...(status && { status }), ...(q && { q }), page: String(pageN) })}`), [status, q, pageN]);
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== "page") n.delete("page"); setSp(n); };
  return <Page title="Orders">
    <div className="filters">
      <input className="search" placeholder="Search order # or email" defaultValue={q} onKeyDown={e => e.key === "Enter" && set("q", (e.target as HTMLInputElement).value)} />
      <div className="chips"><button className={!status ? "on" : ""} onClick={() => set("status", "")}>All</button>{STATUSES.map(s => <button key={s} className={status === s ? "on" : ""} onClick={() => set("status", s)}>{s}</button>)}</div>
    </div>
    {error && <p className="error">{error}</p>}
    {data && (data.orders.length ? <>
      <table className="table card"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Status</th><th className="num">Total</th></tr></thead>
        <tbody>{data.orders.map((o: any) => <tr key={o._id}>
          <td><Link to={`/orders/${o._id}`}>{o.number}</Link></td><td className="muted">{date(o.createdAt)}</td><td>{o.email}</td>
          <td className="muted">{o.items.reduce((n: number, i: any) => n + i.qty, 0)} · {o.items.some((i: any) => i.kind === "course") ? "incl. course" : "products"}</td>
          <td><Badge status={o.status} /></td><td className="num">{money(o.total)}</td></tr>)}</tbody></table>
      {data.pages > 1 && <div className="pager"><button disabled={pageN <= 1} onClick={() => set("page", String(pageN - 1))}>← Prev</button><span>Page {pageN} of {data.pages}</span><button disabled={pageN >= data.pages} onClick={() => set("page", String(pageN + 1))}>Next →</button></div>}
    </> : <Empty>No orders match.</Empty>)}
  </Page>;
}

export function OrderDetail() {
  const { id } = useParams();
  const { data, error, reload } = useLoad(() => api(`/admin/orders/${id}`), [id]);
  const [status, setStatus] = useState(""); const [tracking, setTracking] = useState<string | null>(null); const [notify, setNotify] = useState(true); const [busy, setBusy] = useState(false);
  if (error) return <Page title="Order"><p className="error">{error}</p></Page>;
  if (!data) return <Page title="Order"><p className="muted">Loading…</p></Page>;
  const o = data.order;
  const save = async () => {
    setBusy(true);
    try { await api(`/admin/orders/${o._id}`, { method: "PATCH", body: { ...(status && { status }), ...(tracking !== null && { trackingNumber: tracking }), notify } }); toast.ok("Order updated"); setStatus(""); setTracking(null); reload(); }
    catch (e) { toast.err(e); } finally { setBusy(false); }
  };
  const refund = async () => {
    const amt = prompt(`Refund amount in USD (leave blank for full ${money(o.total)})`, "");
    if (amt === null) return;
    if (!confirm(`Refund ${amt ? money(Number(amt)) : money(o.total)} to ${o.email} via Stripe?`)) return;
    try { const r = await api(`/admin/orders/${o._id}/refund`, { body: amt ? { amount: Number(amt) } : {} }); toast.ok(`Refund ${r.refund.status}: ${money(r.refund.amount)}`); reload(); } catch (e) { toast.err(e); }
  };
  const a = o.shippingAddress;
  return <Page title={`Order ${o.number}`} actions={<><Badge status={o.status} />{o.stripePaymentIntent && o.status !== "refunded" && <button className="btn" onClick={refund}>Refund…</button>}</>}>
    <div className="two wide-left">
      <section className="card">
        <h2>Items</h2>
        <table className="table"><tbody>{o.items.map((i: any, k: number) => <tr key={k}><td>{i.image && <img className="mini" src={i.image} alt="" />}</td><td>{i.name}{i.variant && <span className="muted"> · {i.variant}</span>}<div className="muted small">{i.kind}</div></td><td className="num">{i.qty} × {money(i.price)}</td><td className="num">{money(i.qty * i.price)}</td></tr>)}</tbody></table>
        <dl className="totals"><dt>Subtotal</dt><dd>{money(o.subtotal)}</dd>
          {o.discount > 0 && <><dt>Discount {o.coupon?.code && <code>{o.coupon.code}</code>}</dt><dd>−{money(o.discount)}</dd></>}
          <dt>Shipping</dt><dd>{money(o.shipping)}</dd>{o.tax > 0 && <><dt>Tax</dt><dd>{money(o.tax)}</dd></>}<dt className="strong">Total</dt><dd className="strong">{money(o.total)}</dd></dl>
      </section>
      <div className="stack">
        <section className="card"><h2>Customer</h2><p>{o.user?.name || "—"}<br /><a href={`mailto:${o.email}`}>{o.email}</a>{o.phone && <><br />{o.phone}</>}</p>
          {a?.line1 && <><h3>Ship to</h3><p>{a.name}<br />{a.line1}{a.line2 && <>, {a.line2}</>}<br />{a.city}, {a.state} {a.postal_code}<br />{a.country}</p></>}
          <p className="muted small">Placed {date(o.createdAt)}{o.paidAt && <> · Paid {date(o.paidAt)}</>}</p>
          {o.stripePaymentIntent && <p className="muted small">Stripe: <code>{o.stripePaymentIntent}</code></p>}
        </section>
        <section className="card"><h2>Fulfilment</h2>
          <Field label="Status"><select value={status || o.status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
          {o.requiresShipping && <Field label="Tracking number"><input value={tracking ?? o.trackingNumber ?? ""} onChange={e => setTracking(e.target.value)} /></Field>}
          <label className="check"><input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} /> Email the customer about status changes</label>
          <button className="btn primary" onClick={save} disabled={busy || (!status && tracking === null)}>Save</button>
        </section>
        <section className="card"><h2>History</h2><ol className="history">{[...o.history].reverse().map((h: any, i: number) => <li key={i}><Badge status={h.status} /><span>{h.note}</span><time>{date(h.at)}</time></li>)}</ol></section>
      </div>
    </div>
  </Page>;
}
