import { useState } from "react";
import { api, date } from "../api";
import { Page, useLoad, Empty, Modal, Field, toast } from "../components/ui";

export function Customers() {
  const [q, setQ] = useState(""); const [pageN, setPage] = useState(1);
  const { data, error, reload } = useLoad(() => api(`/admin/users?${new URLSearchParams({ q, page: String(pageN) })}`), [q, pageN]);
  const courses = useLoad(() => api("/admin/courses"));
  const [grant, setGrant] = useState<any>(null); const [courseId, setCourseId] = useState("");
  const patch = async (u: any, body: any, msg: string) => { try { await api(`/admin/users/${u.id}`, { method: "PATCH", body }); toast.ok(msg); reload(); } catch (e) { toast.err(e); } };
  const doGrant = async () => { try { await api(`/admin/users/${grant.id}/courses`, { body: { courseId } }); toast.ok("Course access granted"); setGrant(null); reload(); } catch (e) { toast.err(e); } };
  const revoke = async (u: any, c: any) => { if (!confirm(`Remove ${c.title} from ${u.email}?`)) return; try { await api(`/admin/users/${u.id}/courses/${c.id}`, { method: "DELETE" }); reload(); } catch (e) { toast.err(e); } };
  return <Page title="Customers">
    <div className="filters"><input className="search" placeholder="Search name or email" onKeyDown={e => { if (e.key === "Enter") { setPage(1); setQ((e.target as HTMLInputElement).value); } }} /></div>
    {error && <p className="error">{error}</p>}
    {data && (data.users.length ? <>
      <table className="table card"><thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Last login</th><th>Courses</th><th>Role</th><th /></tr></thead>
        <tbody>{data.users.map((u: any) => <tr key={u.id} className={u.active ? "" : "dim"}>
          <td>{u.name || "—"}</td><td>{u.email}</td><td className="muted">{date(u.createdAt)}</td><td className="muted">{date(u.lastLoginAt)}</td>
          <td>{u.courses.map((c: any) => <span className="pill" key={c.id}>{c.title} <button className="x" onClick={() => revoke(u, c)} aria-label={`Remove ${c.title}`}>×</button></span>)}<button className="link small" onClick={() => { setGrant(u); setCourseId(""); }}>+ Grant</button></td>
          <td><select value={u.role} onChange={e => patch(u, { role: e.target.value }, "Role updated")}><option value="customer">customer</option><option value="admin">admin</option></select></td>
          <td><button className="link small" onClick={() => patch(u, { active: !u.active }, u.active ? "Account disabled" : "Account enabled")}>{u.active ? "Disable" : "Enable"}</button></td></tr>)}</tbody></table>
      {data.pages > 1 && <div className="pager"><button disabled={pageN <= 1} onClick={() => setPage(pageN - 1)}>← Prev</button><span>Page {pageN} of {data.pages}</span><button disabled={pageN >= data.pages} onClick={() => setPage(pageN + 1)}>Next →</button></div>}
    </> : <Empty>No customers found.</Empty>)}
    {grant && <Modal title={`Grant a course to ${grant.email}`} onClose={() => setGrant(null)} footer={<><button className="btn" onClick={() => setGrant(null)}>Cancel</button><button className="btn primary" disabled={!courseId} onClick={doGrant}>Grant access</button></>}>
      <Field label="Course"><select value={courseId} onChange={e => setCourseId(e.target.value)}><option value="">Select…</option>{courses.data?.courses.map((c: any) => <option key={c._id} value={c._id}>{c.title}</option>)}</select></Field>
    </Modal>}
  </Page>;
}
