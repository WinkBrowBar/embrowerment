import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type Product, type Course } from "@/lib/api";
import { useStore } from "@/components/site";
import { useRequireUser } from "./account";
import { ProductCard } from "./shop.index";
import { CourseCard } from "./academy.index";

export const Route = createFileRoute("/wishlist")({ head: () => ({ meta: [{ title: "Wishlist — Embrowerment®" }, { name: "robots", content: "noindex" }] }), component: Wishlist });

function Wishlist() {
  const user = useRequireUser(); const { wish } = useStore();
  const [d, setD] = useState<{ products: Product[]; courses: Course[] } | null>(null);
  useEffect(() => { if (user) api<{ products: Product[]; courses: Course[] }>("/wishlist").then(setD); }, [user, wish]);
  const empty = d && !d.products.length && !d.courses.length;
  return <section className="feat">
    <h1 className="h-display page-title">Wishlist</h1>
    {!d ? <p className="muted">Loading…</p> : empty ? <p className="lede">Nothing saved yet. <Link to="/shop" className="link">Explore the shop</Link></p> : <>
      {d.products.length > 0 && <div className="pgrid">{d.products.map(p => <ProductCard key={p.id} p={p} />)}</div>}
      {d.courses.length > 0 && <><h2 className="eyebrow section-gap">Courses</h2><div className="courses">{d.courses.map(c => <CourseCard key={c.id} c={c} />)}</div></>}
    </>}
  </section>;
}
