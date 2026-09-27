import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, ApiError, type Course } from "@/lib/api";
import { useStore } from "@/components/site";

export const Route = createFileRoute("/learn/$slug")({
  validateSearch: (s: Record<string, unknown>): { lesson?: string | undefined } => ({ lesson: typeof s["lesson"] === "string" ? s["lesson"] : undefined }),
  head: () => ({ meta: [{ title: "Course — Embrowerment® Academy" }, { name: "robots", content: "noindex" }] }),
  component: Learn,
});

function embed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  return url ? { type: "video", src: url } : null;
}

function Learn() {
  const { slug } = Route.useParams(); const { lesson } = Route.useSearch();
  const { user, ready } = useStore(); const nav = useNavigate();
  const [c, setC] = useState<Course | null>(null); const [err, setErr] = useState("");
  useEffect(() => {
    if (!ready) return;
    const load = user ? api<{ course: Course }>(`/courses/${slug}/learn`).catch(e => { if (e instanceof ApiError && e.status === 403) return api<{ course: Course }>(`/courses/${slug}`); throw e; }) : api<{ course: Course }>(`/courses/${slug}`);
    load.then(d => setC(d.course)).catch(e => setErr(e.message));
  }, [slug, user, ready]);
  if (err) return <section className="phero phero--text"><div className="phero-text"><h1 className="h-display">Course</h1><div className="phero-body"><p>{err}</p></div></div></section>;
  if (!c) return <section className="phero phero--text"><div className="phero-text"><p className="muted">Loading…</p></div></section>;
  const playable = c.lessons.filter(l => c.owned || l.preview);
  const cur = c.lessons.find(l => l.id === lesson && (c.owned || l.preview)) || playable[0];
  const media = cur?.videoUrl ? embed(cur.videoUrl) : null;
  return <section className="learn">
    <div className="learn-main">
      <nav className="crumbs"><Link to="/academy">Academy</Link> › <Link to="/academy/$slug" params={{ slug: c.slug }}>{c.title}</Link></nav>
      <div className="player">
        {media?.type === "iframe" && <iframe src={media.src} title={cur?.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
        {media?.type === "video" && <video src={media.src} controls playsInline />}
        {!media && <div className="player-empty">{cur ? "Video coming soon." : "Purchase this course to start learning."}</div>}
      </div>
      <h1>{cur?.title || c.title}</h1>
      {cur?.content && cur.content.split(/\n+/).map((t, i) => <p key={i}>{t}</p>)}
      {!c.owned && <p className="notice">You're watching a free preview. <Link to="/academy/$slug" params={{ slug: c.slug }}>Purchase the course</Link> to unlock every lesson.</p>}
    </div>
    <aside className="learn-side">
      <h2>{c.title}</h2>
      <ol className="lessons">{c.lessons.map((l, i) => {
        const open = c.owned || l.preview;
        return <li key={l.id} className={cur?.id === l.id ? "on" : ""}><span className="n">{String(i + 1).padStart(2, "0")}</span>
          {open ? <button className="t link-plain" onClick={() => nav({ to: "/learn/$slug", params: { slug }, search: { lesson: l.id } })}>{l.title}</button> : <span className="t muted-t">🔒 {l.title}</span>}
          <span className="muted-t">{l.durationMin ? `${l.durationMin}m` : ""}</span></li>;
      })}</ol>
    </aside>
  </section>;
}
