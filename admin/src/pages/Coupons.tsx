import { useState } from "react";
import { api, money, date } from "../api";
import { Page, useLoad, Empty, Field, Toggle, Modal, toast } from "../components/ui";

const blank = { code: "", description: "", type: "percent", value: 10, appliesTo: "all", minSubtotal: 0, maxUses: 0, perUserLimit: 0, startsAt: "", expiresAt: "", active: true };
const toInput = (d?: string) => (d ? new Date(d).toISOString().slice(0, 16) : "");

export function Coupons() {
  const { data, error, reload } = useLoad(() => api("/admin/coupons"));
  const [edit, setEdit] = useState<any>(null); const [busy, setBusy] = useState(false);
  const set = (k: string, v: unknown) => setEdit((x: any) => ({ ...x, [k]: v }));
  const save = async () => {
    setBusy(true);
    try {
      const body = { ...edit, startsAt: edit.startsAt || null, expiresAt: edit.expiresAt || null }; ["_id", "createdAt", "updatedAt", "__v", "usedCount"].forEach(k => delete body[k]);
      await (edit._id ? api(`/admin/coupons/${edit._id}`, { method: "PUT", body }) : api("/admin/coupons", { body }));
      toast.ok("Coupon saved"); setEdit(null); reload();
    } catch (e) { toast.err(e); } finally { setBusy(false); }
  };
  const del = async (c: any) => { if (!confirm(`Delete coupon ${c.code}?`)) return; try { await api(`/admin/coupons/${c._id}`, { method: "DELETE" }); reload(); } catch (e) { toast.err(e); } };
  const status = (c: any) => !c.active ? "Disabled" : c.expiresAt && new Date(c.expiresAt) < new Date() ? "Expired" : c.maxUses && c.usedCount >= c.maxUses ? "Used up" : "Active";
  return <Page title="Coupons" actions={<button className="btn primary" onClick={() => setEdit({ ...blank })}>+ New coupon</button>}>
    {error && <p className="error">{error}</p>}
    {data && (data.coupons.length ? <table className="table card"><thead><tr><th>Code</th><th>Discount</th><th>Applies to</th><th>Min spend</th><th className="num">Used</th><th>Expires</th><th>Status</th><th /></tr></thead>
      <tbody>{data.coupons.map((c: any) => <tr key={c._id}>
        <td><button className="link strong" onClick={() => setEdit({ ...c, startsAt: toInput(c.startsAt), expiresAt: toInput(c.expiresAt) })}><code>{c.code}</code></button><div className="muted small">{c.description}</div></td>
        <td>{c.type === "percent" ? `${c.value}%` : money(c.value)}</td><td>{c.appliesTo}</td><td>{c.minSubtotal ? money(c.minSubtotal) : "—"}</td>
        <td className="num">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td><td className="muted">{c.expiresAt ? date(c.expiresAt) : "Never"}</td>
        <td><span className={status(c) === "Active" ? "ok" : "muted"}>{status(c)}</span></td><td><button className="icon" onClick={() => del(c)} aria-label="Delete">✕</button></td></tr>)}</tbody></table> : <Empty>No coupons yet.</Empty>)}
    {edit && <Modal title={edit._id ? `Edit ${edit.code}` : "New coupon"} onClose={() => setEdit(null)} footer={<><button className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn primary" onClick={save} disabled={busy}>Save</button></>}>
      <div className="grid-form">
        <Field label="Code"><input value={edit.code} onChange={e => set("code", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="SPRING20" /></Field>
        <Field label="Description"><input value={edit.description} onChange={e => set("description", e.target.value)} /></Field>
        <Field label="Type"><select value={edit.type} onChange={e => set("type", e.target.value)}><option value="percent">Percent off</option><option value="fixed">Fixed amount off</option></select></Field>
        <Field label={edit.type === "percent" ? "Percent" : "Amount (USD)"}><input type="number" min="0" step="0.01" value={edit.value} onChange={e => set("value", e.target.value)} /></Field>
        <Field label="Applies to"><select value={edit.appliesTo} onChange={e => set("appliesTo", e.target.value)}><option value="all">Everything</option><option value="products">Products only</option><option value="courses">Courses only</option></select></Field>
        <Field label="Minimum spend"><input type="number" min="0" value={edit.minSubtotal} onChange={e => set("minSubtotal", e.target.value)} /></Field>
        <Field label="Total uses" hint="0 = unlimited"><input type="number" min="0" value={edit.maxUses} onChange={e => set("maxUses", e.target.value)} /></Field>
        <Field label="Uses per customer" hint="0 = unlimited"><input type="number" min="0" value={edit.perUserLimit} onChange={e => set("perUserLimit", e.target.value)} /></Field>
        <Field label="Starts"><input type="datetime-local" value={edit.startsAt} onChange={e => set("startsAt", e.target.value)} /></Field>
        <Field label="Expires"><input type="datetime-local" value={edit.expiresAt} onChange={e => set("expiresAt", e.target.value)} /></Field>
        <div className="field wide"><Toggle checked={edit.active} onChange={v => set("active", v)} label="Active" /></div>
      </div>
    </Modal>}
  </Page>;
}
