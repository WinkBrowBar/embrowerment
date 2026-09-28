import { createFileRoute, Link } from "@tanstack/react-router";
import { api, money, type Product } from "@/lib/api";
import { WishButton, useStore, IMG, SafeImg } from "@/components/site";

type Search = { category?: string | undefined };
export const Route = createFileRoute("/shop/")({
  validateSearch: (s: Record<string, unknown>): Search => ({ category: typeof s["category"] === "string" ? s["category"] : undefined }),
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: ({ deps }) => api<{ products: Product[]; categories: string[] }>(`/products${deps.category ? `?category=${encodeURIComponent(deps.category)}` : ""}`),
  head: () => ({ meta: [{ title: "Shop — Embrowerment®" }, { name: "description", content: "Discover essentials that bring confidence to your every day with intention." }] }),
  errorComponent: () => <section className="phero phero--text"><div className="phero-text"><h1 className="h-display">Shop</h1><div className="phero-body"><p>The shop is temporarily unavailable. Please try again shortly.</p></div></div></section>,
  component: Shop,
});

export function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();
  return <article className="pcard">
    <div className="pcard-img">
      <Link to="/shop/$slug" params={{ slug: p.slug }}><SafeImg src={p.images[0]} alt={p.name} loading="lazy" /></Link>
      <div className="pcard-wish"><WishButton kind="product" id={p.id} label={false} /></div>
      {p.comingSoon ? <span className="tag">Coming soon</span> : !p.inStock && <span className="tag">Sold out</span>}
    </div>
    <div className="pcard-meta">
      <Link to="/shop/$slug" params={{ slug: p.slug }}><h3>{p.name}</h3></Link>
      <span>{p.compareAtPrice ? <s>{money(p.compareAtPrice)}</s> : null}{money(p.price)}</span>
    </div>
    {p.tagline && <p className="pcard-tag">{p.tagline}</p>}
    {p.comingSoon ? <Link to="/shop/$slug" params={{ slug: p.slug }} className="btn-mono">Coming soon</Link> : p.variants.length ? <Link to="/shop/$slug" params={{ slug: p.slug }} className="btn-mono">Choose {p.variantLabel.toLowerCase() || "option"}</Link>
      : <button className="btn-mono" disabled={!p.inStock} onClick={() => add({ kind: "product", ref: p.id, qty: 1 })}>{p.inStock ? "Add to bag" : "Sold out"}</button>}
  </article>;
}

function Shop() {
  const { products, categories } = Route.useLoaderData();
  const { category } = Route.useSearch();
  return <>
    <section className="shop-hero">
      <div className="reveal"><h1 className="h-display">Shop the Collection</h1><p className="lede">Discover essentials that bring confidence to your every day with intention.</p></div>
      <img src={IMG.collection} alt="Embrowerment® product collection" />
    </section>
    <section className="feat">
      <div className="filters">
        <Link to="/shop" search={{}} className={!category ? "on" : ""}>All</Link>
        {categories.map(c => <Link key={c} to="/shop" search={{ category: c }} className={category === c ? "on" : ""}>{c}</Link>)}
      </div>
      {products.length ? <div className="pgrid">{products.map(p => <ProductCard key={p.id} p={p} />)}</div> : <p className="muted">No products found.</p>}
    </section>
  </>;
}