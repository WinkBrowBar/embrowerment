import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { api, money, type Order } from "@/lib/api";
import { useStore, SafeImg } from "@/components/site";

type Tab = "orders" | "courses" | "profile";
export const Route = createFileRoute("/account")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab | undefined } => ({ tab: ["orders", "courses", "profile"].includes(s["tab"] as string) ? (s["tab"] as Tab) : undefined }),
  head: () => ({ meta: [{ title: "Your account — Embrowerment®" }, { name: "robots", content: "noindex" }] }),
  component: Account,
});

export function useRequireUser() {
  const { user, ready } = useStore(); const nav = useNavigate();
  useEffect(() => { if (ready && !user) nav({ to: "/login", search: { next: window.location.pathname + window.location.search } }); }, [ready, user, nav]);
  return ready && user ? user : null;
}

export const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Account() {
  const user = useRequireUser(); const { logout, setUser } = useStore(); const nav = useNavigate();
  const tab = Route.useSearch().tab || "orders";
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [courses, setCourses] = useState<{ id: string; title: string; slug: string; image: string; lessonCount: number }[] | null>(null);
  const [name, setName] = useState(""); const [pw, setPw] = useState({ current: "", password: "" }); const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { if (!user) return; setName(user.name); api<{ orders: Order[] }>("/orders").then(d => setOrders(d.orders)); api<{ courses: any[] }>("/my/courses").then(d => setCourses(d.courses)); }, [user]);
  if (!user) return <section className="feat"><p className="muted">Loading…</p></section>;
  const saveName = async (e: FormEvent) => { e.preventDefault(); setMsg(""); setErr(""); try { setUser((await api("/auth/me", { method: "PATCH", body: { name } })).user); setMsg("Profile saved"); } catch (x) { setErr((x as Error).message); } };
  const savePw = async (e: FormEvent) => { e.preventDefault(); setMsg(""); setErr(""); try { await api("/auth/change-password", { body: pw }); setPw({ current: "", password: "" }); setMsg("Password updated"); } catch (x) { setErr((x as Error).message); } };
  return <section className="feat account">
    <div className="account-head"><div><span className="eyebrow">Account</span><h1 className="h-display">Hello{user.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1><p className="muted-t">{user.email}</p></div>
      <div className="row"><Link to="/wishlist" className="btn-mono">Wishlist</Link><button className="btn-mono" onClick={async () => { await logout(); nav({ to: "/" }); }}>Log out</button></div></div>
    <div className="filters">{(["orders", "courses", "profile"] as Tab[]).map(t => <Link key={t} to="/account" search={{ tab: t }} className={tab === t ? "on" : ""}>{t === "orders" ? "Orders" : t === "courses" ? "My courses" : "Profile"}</Link>)}</div>

    {tab === "orders" && (orders === null ? <p className="muted">Loading…</p> : orders.length ? <table className="otable"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Items</th><th className="num">Total</th></tr></thead>
      <tbody>{orders.map(o => <tr key={o.id}><td><Link to="/account/orders/$id" params={{ id: o.id }}>{o.number}</Link></td><td>{new Date(o.createdAt).toLocaleDateString()}</td><td><span className={`status s-${o.status}`}>{statusLabel(o.status)}</span></td><td>{o.items.reduce((n, i) => n + i.qty, 0)}</td><td className="num">{money(o.total)}</td></tr>)}</tbody></table>
      : <p className="lede">No orders yet. <Link to="/shop" className="link">Start shopping</Link></p>)}

    {tab === "courses" && (courses === null ? <p className="muted">Loading…</p> : courses.length ? <div className="courses">{courses.map(c => <article className="course" key={c.id}>
      <div className="pcard-img"><Link to="/learn/$slug" params={{ slug: c.slug }} search={{ lesson: undefined }}><SafeImg src={c.image} alt={c.title} /></Link></div>
      <div className="card-meta"><h3>{c.title}</h3><span className="muted-t">{c.lessonCount} lesson{c.lessonCount === 1 ? "" : "s"}</span></div>
      <Link to="/learn/$slug" params={{ slug: c.slug }} search={{ lesson: undefined }} className="btn-solid">Start course</Link></article>)}</div>
      : <p className="lede">You haven't enrolled in any courses yet. <Link to="/academy" className="link">Browse the Academy</Link></p>)}

    {tab === "profile" && <div className="profile-grid">
      <form className="form" onSubmit={saveName}><h2>Profile</h2><label>Name<input value={name} onChange={e => setName(e.target.value)} /></label><label>Email<input value={user.email} disabled /></label><button className="btn-solid">Save</button></form>
      <form className="form" onSubmit={savePw}><h2>Change password</h2><label>Current password<input type="password" autoComplete="current-password" required value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} /></label>
        <label>New password<input type="password" autoComplete="new-password" minLength={8} required value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })} /></label><button className="btn-solid">Update password</button></form>
      {(msg || err) && <p className={err ? "form-error" : "notice"}>{err || msg}</p>}
    </div>}
  </section>;
}
