import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, money, ApiError, type Course } from "@/lib/api";
import { useStore, WishButton, SafeImg } from "@/components/site";

export const Route = createFileRoute("/academy/$slug")({
  loader: async ({ params }) => {
    try { return await api<{ course: Course }>(`/courses/${params.slug}`); }
    catch (e) { if (e instanceof ApiError && e.status === 404) throw notFound(); throw e; }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.course.title} — Embrowerment® Academy` }, { name: "description", content: loaderData.course.summary || loaderData.course.title }] : [] }),
  component: CoursePage,
});

function CoursePage() {
  const initial = Route.useLoaderData().course;
  const { user, add, lines } = useStore();
  const [c, setC] = useState(initial);
  useEffect(() => { setC(initial); if (user) api<{ course: Course }>(`/courses/${initial.slug}`).then(d => setC(d.course)).catch(() => {}); }, [user, initial]);
  const inBag = lines.some(l => l.kind === "course" && l.ref === c.id);
  return <section className="pdp">
    <div className="pdp-gallery"><div className="pdp-img cover"><SafeImg src={c.image} alt={c.title} /></div></div>
    <div className="pdp-info">
      <nav className="crumbs"><Link to="/">Home</Link> › <Link to="/academy">Academy</Link> › <span>{c.title}</span></nav>
      <h1>{c.title}</h1>
      <p className="pdp-price">{money(c.price)}</p>
      {c.summary && <p className="pdp-tag">{c.summary}</p>}
      {c.description && c.description.split(/\n+/).map((t, i) => <p key={i}>{t}</p>)}
      {c.points.length > 0 && <ul className="points">{c.points.map(p => <li key={p}>{p}</li>)}</ul>}
      <div className="pdp-buy">
        {c.owned ? <Link to="/learn/$slug" params={{ slug: c.slug }} className="btn-solid">Start course</Link>
          : <button className="btn-solid" onClick={() => add({ kind: "course", ref: c.id, qty: 1 })}>{inBag ? "In your bag" : "Purchase Course"}</button>}
      </div>
      <WishButton kind="course" id={c.id} />
      <div className="pdp-acc"><h2 className="pdp-acc-h">{c.lessonCount} lesson{c.lessonCount === 1 ? "" : "s"}{c.totalMinutes ? ` · ${c.totalMinutes} min` : ""}</h2>
        <ol className="lessons">{c.lessons.map((l, i) => <li key={l.id}><span className="n">{String(i + 1).padStart(2, "0")}</span><span className="t">{l.title}</span>
          {l.preview && !c.owned ? <Link to="/learn/$slug" params={{ slug: c.slug }} search={{ lesson: l.id }} className="link">Preview</Link> : <span className="muted-t">{l.durationMin ? `${l.durationMin} min` : ""}</span>}</li>)}</ol>
      </div>
    </div>
  </section>;
}
