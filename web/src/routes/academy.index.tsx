import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, money, type Course } from "@/lib/api";
import { PageHero, useStore, WishButton, IMG, SafeImg } from "@/components/site";

export const Route = createFileRoute("/academy/")({
  loader: () => api<{ courses: Course[] }>("/courses"),
  head: () => ({ meta: [{ title: "Academy — Embrowerment®" }, { name: "description", content: "Online brow courses from the Embrowerment® Academy." }] }),
  errorComponent: () => <PageHero title="Academy ."><p>Courses are temporarily unavailable. Please try again shortly.</p></PageHero>,
  component: Academy,
});

/** Re-fetch on the client so "owned" reflects the signed-in user. */
export function useOwnedCourses(initial: Course[]) {
  const { user } = useStore();
  const [list, setList] = useState(initial);
  useEffect(() => { if (user) api<{ courses: Course[] }>("/courses").then(d => setList(d.courses)).catch(() => {}); else setList(initial); }, [user, initial]);
  return list;
}

export function CourseCard({ c }: { c: Course }) {
  const { add } = useStore();
  return <article className="course reveal">
    <div className="pcard-img">
      <Link to="/academy/$slug" params={{ slug: c.slug }}><SafeImg src={c.image} alt={c.title} loading="lazy" /></Link>
      <div className="pcard-wish"><WishButton kind="course" id={c.id} label={false} /></div>
    </div>
    <div className="card-meta"><Link to="/academy/$slug" params={{ slug: c.slug }}><h3>{c.title}</h3></Link><span className="card-price">{money(c.price)}</span></div>
    {c.points.length > 0 && <ul>{c.points.map(p => <li key={p}>{p}</li>)}</ul>}
    {c.owned ? <Link to="/learn/$slug" params={{ slug: c.slug }} className="btn-solid">Start course</Link>
      : <button className="btn-mono" onClick={() => add({ kind: "course", ref: c.id, qty: 1 })}>Purchase Course</button>}
  </article>;
}

function Academy() {
  const data = Route.useLoaderData();
  const courses = useOwnedCourses(data.courses);
  return <>
    <PageHero title="Academy ." image={IMG.academy} alt="Close-up of an eye and a defined brow" />
    <section className="feat">
      {courses.length ? <div className="courses">{courses.map(c => <CourseCard key={c.id} c={c} />)}</div> : <p className="muted">No courses yet.</p>}
    </section>
  </>;
}
