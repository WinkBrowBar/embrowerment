import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, money, date } from "../api";
import { Page, Badge, useLoad, Empty, Modal, Field, toast } from "../components/ui";

function Stats() {
  const { data } = useLoad(() => api("/admin/foundation/stats"));
  if (!data) return null;
  return <div className="stats">
    <div className="stat"><span>Raised · 30 days</span><b>{money(data.raised30)}</b></div>
    <div className="stat"><span>Raised · all time</span><b>{money(data.raisedAll)}</b><small>{data.donors} donors</small></div>
    <div className="stat"><span>Active recurring</span><b>{data.activeRecurring}</b><small>≈ {money(data.monthlyRecurring)} / month</small></div>
    <div className="stat"><span>Unread messages</span><b>{data.unreadMessages}</b></div>
  </div>;
}

const DSTAT = ["paid", "active", "cancelled", "failed", "refunded", "pending"];

export function Donations() {
  const [sp, setSp] = useSearchParams();
  const status = sp.get("status") || ""; const frequency = sp.get("frequency") || ""; const q = sp.get("q") || ""; const pageN = Number(sp.get("page") || 1);
  const { data, error, reload } = useLoad(() => api(`/admin/foundation/donations?${new URLSearchParams({ ...(status && { status }), ...(frequency && { frequency }), ...(q && { q }), page: String(pageN) })}`), [status, frequency, q, pageN]);
  const [open, setOpen] = useState<any>(null);
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== "page") n.delete("page"); setSp(n); };
  const act = async (path: string, confirmMsg: string, ok: string) => { if (!confirm(confirmMsg)) return; try { await api(`/admin/foundation/donations/${open._id}/${path}`, { body: {} }); toast.ok(ok); setOpen(null); reload(); } catch (e) { toast.err(e); } };
  return <Page title="Foundation · Donations">
    <Stats />
    <div className="filters">
      <input className="search" placeholder="Search receipt #, name or email" defaultValue={q} onKeyDown={e => e.key === "Enter" && set("q", (e.target as HTMLInputElement).value)} />
      <div className="chips"><button className={!status ? "on" : ""} onClick={() => set("status", "")}>All</button>{DSTAT.map(s => <button key={s} className={status === s ? "on" : ""} onClick={() => set("status", s)}>{s}</button>)}</div>
      <div className="chips"><button className={!frequency ? "on" : ""} onClick={() => set("frequency", "")}>Any frequency</button>{["one-time", "monthly", "quarterly", "annual"].map(f => <button key={f} className={frequency === f ? "on" : ""} onClick={() => set("frequency", f)}>{f}</button>)}</div>
    </div>
    {error && <p className="error">{error}</p>}
    {data && (data.donations.length ? <>
      <table className="table card"><thead><tr><th>Receipt</th><th>Date</th><th>Donor</th><th>Designation</th><th>Frequency</th><th>Status</th><th className="num">Per gift</th><th className="num">Received</th></tr></thead>
        <tbody>{data.donations.map((d: any) => <tr key={d._id}>
          <td><button className="link strong" onClick={() => setOpen(d)}>{d.number}</button></td><td className="muted">{date(d.createdAt)}</td>
          <td>{d.anonymous ? <span className="muted">Anonymous</span> : d.donor?.name || "—"}<div className="muted small">{d.donor?.email}</div></td>
          <td>{d.designation?.label}</td><td>{d.frequency}</td><td><Badge status={d.status} /></td>
          <td className="num">{money(d.total)}{d.fee > 0 && <div className="muted small">incl. {money(d.fee)} fee</div>}</td><td className="num">{money(d.totalReceived)}</td></tr>)}</tbody></table>
      {data.pages > 1 && <div className="pager"><button disabled={pageN <= 1} onClick={() => set("page", String(pageN - 1))}>← Prev</button><span>Page {pageN} of {data.pages}</span><button disabled={pageN >= data.pages} onClick={() => set("page", String(pageN + 1))}>Next →</button></div>}
    </> : <Empty>No donations yet.</Empty>)}
    {open && <Modal title={`Donation ${open.number}`} onClose={() => setOpen(null)} footer={<>
      <button className="btn" onClick={() => act("resend-receipt", `Resend receipt to ${open.donor?.email}?`, "Receipt sent")} disabled={!open.donor?.email}>Resend receipt</button>
      {open.stripeSubscriptionId && open.status !== "cancelled" && <button className="btn danger" onClick={() => act("cancel", "Cancel this recurring donation in Stripe? Future charges will stop.", "Recurring donation cancelled")}>Cancel recurring</button>}
      {(open.stripePaymentIntent || open.payments?.length > 0) && open.status !== "refunded" && <button className="btn danger" onClick={() => act("refund", "Refund the most recent payment in Stripe?", "Refund issued")}>Refund last payment</button>}
    </>}>
      <dl className="totals"><dt>Donor</dt><dd>{open.donor?.name || "—"}{open.anonymous && " (anonymous)"}</dd><dt>Email</dt><dd>{open.donor?.email || "—"}</dd>
        <dt>Designation</dt><dd>{open.designation?.label}</dd><dt>Frequency</dt><dd>{open.frequency}</dd><dt>Gift</dt><dd>{money(open.amount)}</dd><dt>Fee covered</dt><dd>{money(open.fee)}</dd>
        <dt className="strong">Total per gift</dt><dd className="strong">{money(open.total)}</dd><dt>Status</dt><dd><Badge status={open.status} /></dd><dt>Stripe account</dt><dd>{open.stripeAccount}</dd>
        {open.stripeSubscriptionId && <><dt>Subscription</dt><dd><code>{open.stripeSubscriptionId}</code></dd></>}{open.note && <><dt>Note</dt><dd>{open.note}</dd></>}</dl>
      <h3>Payments</h3>
      {open.payments?.length ? <table className="table"><tbody>{open.payments.map((p: any, i: number) => <tr key={i}><td>{date(p.at)}</td><td className="muted small"><code>{p.paymentIntent || p.invoice}</code></td><td className="num">{money(p.amount)}</td></tr>)}</tbody></table> : <p className="muted">No payments recorded yet.</p>}
    </Modal>}
  </Page>;
}

const MSTAT = ["new", "read", "replied", "archived", "spam"];

export function Messages() {
  const [status, setStatus] = useState(""); const [q, setQ] = useState(""); const [pageN, setPage] = useState(1);
  const { data, error, reload } = useLoad(() => api(`/admin/foundation/messages?${new URLSearchParams({ ...(status && { status }), ...(q && { q }), page: String(pageN) })}`), [status, q, pageN]);
  const [open, setOpen] = useState<any>(null);
  const patch = async (m: any, body: any, msg?: string) => { try { const d = await api(`/admin/foundation/messages/${m._id}`, { method: "PATCH", body }); if (msg) toast.ok(msg); setOpen(open ? d.message : null); reload(); } catch (e) { toast.err(e); } };
  const view = (m: any) => { setOpen(m); if (m.status === "new") patch(m, { status: "read" }); };
  const del = async (m: any) => { if (!confirm("Delete this message permanently?")) return; try { await api(`/admin/foundation/messages/${m._id}`, { method: "DELETE" }); setOpen(null); reload(); } catch (e) { toast.err(e); } };
  return <Page title="Foundation · Messages">
    <div className="filters">
      <input className="search" placeholder="Search name, email or message" onKeyDown={e => { if (e.key === "Enter") { setPage(1); setQ((e.target as HTMLInputElement).value); } }} />
      <div className="chips"><button className={!status ? "on" : ""} onClick={() => setStatus("")}>Inbox</button>{MSTAT.map(s => <button key={s} className={status === s ? "on" : ""} onClick={() => { setPage(1); setStatus(s); }}>{s}</button>)}</div>
    </div>
    {error && <p className="error">{error}</p>}
    {data && (data.messages.length ? <table className="table card"><thead><tr><th>From</th><th>Reason</th><th>Message</th><th>Received</th><th>Status</th></tr></thead>
      <tbody>{data.messages.map((m: any) => <tr key={m._id} className={m.status === "new" ? "unread" : ""} onClick={() => view(m)} style={{ cursor: "pointer" }}>
        <td><b>{m.name}</b>{m.organization && <div className="muted small">{m.organization}</div>}</td><td>{m.reason}</td>
        <td className="muted clip">{m.message}</td><td className="muted">{date(m.createdAt)}</td><td><span className={`badge b-m-${m.status}`}>{m.status}</span></td></tr>)}</tbody></table> : <Empty>No messages.</Empty>)}
    {open && <Modal title={open.reason} onClose={() => setOpen(null)} footer={<>
      <button className="btn danger" onClick={() => del(open)}>Delete</button>
      <select value={open.status} onChange={e => patch(open, { status: e.target.value }, "Status updated")} style={{ width: "auto" }}>{MSTAT.map(s => <option key={s}>{s}</option>)}</select>
      <a className="btn primary" href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.reason}`)}`} onClick={() => patch(open, { status: "replied" })}>Reply by email</a>
    </>}>
      <p><b>{open.name}</b>{open.organization && ` · ${open.organization}`}<br /><a href={`mailto:${open.email}`}>{open.email}</a>{open.phone && ` · ${open.phone}`}</p>
      <p className="muted small">{date(open.createdAt)}</p>
      <p style={{ whiteSpace: "pre-wrap" }}>{open.message}</p>
      <Field label="Internal notes"><textarea rows={3} defaultValue={open.notes || ""} onBlur={e => e.target.value !== (open.notes || "") && patch(open, { notes: e.target.value }, "Notes saved")} /></Field>
    </Modal>}
  </Page>;
}
