import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, money } from "../api";
import { Page, useLoad, Empty, Field, Toggle, ImageUpload, toast } from "../components/ui";

export function Courses() {
  const { data, error } = useLoad(() => api("/admin/courses"));
  return <Page title="Courses" actions={<Link className="btn primary" to="/courses/new">+ New course</Link>}>
    {error && <p className="error">{error}</p>}
    {data && (data.courses.length ? <table className="table card"><thead><tr><th></th><th>Title</th><th className="num">Price</th><th className="num">Lessons</th><th className="num">Students</th><th>Status</th></tr></thead>
      <tbody>{data.courses.map((c: any) => <tr key={c._id}><td>{c.image && <img className="mini" src={c.image} alt="" />}</td><td><Link to={`/courses/${c._id}`}>{c.title}</Link></td><td className="num">{money(c.price)}</td><td className="num">{c.lessons.length}</td><td className="num">{c.students}</td><td>{c.active ? <span className="ok">Active</span> : <span className="muted">Hidden</span>}</td></tr>)}</tbody></table> : <Empty>No courses yet.</Empty>)}
  </Page>;
}

const blank = { title: "", slug: "", summary: "", description: "", price: 0, image: "", points: [] as string[], lessons: [] as any[], active: true, sort: 0 };

export function CourseEdit() {
  const { id } = useParams(); const nav = useNavigate(); const isNew = id === "new";
  const [c, setC] = useState<any>(isNew ? blank : null); const [busy, setBusy] = useState(false);
  useEffect(() => { if (!isNew) api(`/admin/courses/${id}`).then(d => setC(d.course)).catch(toast.err); }, [id, isNew]);
  if (!c) return <Page title="Course"><p className="muted">Loading…</p></Page>;
  const set = (k: string, v: unknown) => setC((x: any) => ({ ...x, [k]: v }));
  const setL = (i: number, f: string, v: unknown) => set("lessons", c.lessons.map((l: any, j: number) => j === i ? { ...l, [f]: v } : l));
  const move = (i: number, d: number) => { const l = [...c.lessons]; const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; set("lessons", l); };
  const save = async () => {
    setBusy(true);
    try {
      const body = { ...c, points: c.points.filter(Boolean) }; ["_id", "createdAt", "updatedAt", "__v", "students"].forEach(k => delete body[k]);
      const d = isNew ? await api("/admin/courses", { body }) : await api(`/admin/courses/${id}`, { method: "PUT", body });
      toast.ok("Course saved"); if (isNew) nav(`/courses/${d.course._id}`, { replace: true }); else setC(d.course);
    } catch (e) { toast.err(e); } finally { setBusy(false); }
  };
  const del = async () => { if (!confirm(`Delete "${c.title}"? Students will lose access.`)) return; try { await api(`/admin/courses/${id}`, { method: "DELETE" }); nav("/courses"); } catch (e) { toast.err(e); } };
  return <Page title={isNew ? "New course" : c.title} actions={<>{!isNew && <button className="btn danger" onClick={del}>Delete</button>}<button className="btn primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</button></>}>
    <div className="two wide-left">
      <div className="stack">
        <section className="card grid-form">
          <Field label="Title" wide><input value={c.title} onChange={e => set("title", e.target.value)} /></Field>
          <Field label="Summary" wide><input value={c.summary} onChange={e => set("summary", e.target.value)} /></Field>
          <Field label="Description" wide><textarea rows={5} value={c.description} onChange={e => set("description", e.target.value)} /></Field>
          <Field label="Price (USD)"><input type="number" min="0" step="0.01" value={c.price} onChange={e => set("price", e.target.value)} /></Field>
          <Field label="Highlights" hint="One per line — shown on the course card" wide><textarea rows={3} value={c.points.join("\n")} onChange={e => set("points", e.target.value.split("\n"))} /></Field>
        </section>
        <section className="card">
          <div className="row-head"><h2>Lessons</h2><button className="btn small" onClick={() => set("lessons", [...c.lessons, { title: "", videoUrl: "", durationMin: 0, content: "", preview: false }])}>+ Add lesson</button></div>
          <p className="muted small">Video URL can be YouTube, Vimeo or a direct .mp4 link. Only paying students (and admins) receive the URL, except lessons marked as free preview.</p>
          {c.lessons.length === 0 && <Empty>No lessons yet.</Empty>}
          {c.lessons.map((l: any, i: number) => <div className="lesson" key={l._id || i}>
            <div className="lesson-n">{i + 1}</div>
            <div className="grid-form">
              <Field label="Title" wide><input value={l.title} onChange={e => setL(i, "title", e.target.value)} /></Field>
              <Field label="Video URL" wide><input value={l.videoUrl} onChange={e => setL(i, "videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=…" /></Field>
              <Field label="Duration (min)"><input type="number" min="0" value={l.durationMin} onChange={e => setL(i, "durationMin", e.target.value)} /></Field>
              <div className="field"><span>&nbsp;</span><Toggle checked={l.preview} onChange={v => setL(i, "preview", v)} label="Free preview" /></div>
              <Field label="Notes / content" wide><textarea rows={2} value={l.content} onChange={e => setL(i, "content", e.target.value)} /></Field>
            </div>
            <div className="lesson-actions"><button className="icon" onClick={() => move(i, -1)} aria-label="Move up">↑</button><button className="icon" onClick={() => move(i, 1)} aria-label="Move down">↓</button><button className="icon" onClick={() => set("lessons", c.lessons.filter((_: any, j: number) => j !== i))} aria-label="Remove">✕</button></div>
          </div>)}
        </section>
      </div>
      <div className="stack">
        <section className="card"><h2>Cover image</h2><ImageUpload value={c.image ? [c.image] : []} onChange={v => set("image", v[0] || "")} /></section>
        <section className="card stack-sm"><Toggle checked={c.active} onChange={v => set("active", v)} label="Visible in academy" /></section>
        <section className="card grid-form one">
          <Field label="URL slug" hint="Leave blank to generate from the title"><input value={c.slug} onChange={e => set("slug", e.target.value)} /></Field>
          <Field label="Sort order"><input type="number" value={c.sort} onChange={e => set("sort", e.target.value)} /></Field>
        </section>
      </div>
    </div>
  </Page>;
}
