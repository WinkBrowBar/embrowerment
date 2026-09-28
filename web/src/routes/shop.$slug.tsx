import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { api, money, ApiError, type Product } from "@/lib/api";
import { useStore, WishButton, Accordion, SafeImg } from "@/components/site";
import { ProductCard } from "./shop.index";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    try { return await api<{ product: Product; related: Product[] }>(`/products/${params.slug}`); }
    catch (e) { if (e instanceof ApiError && e.status === 404) throw notFound(); throw e; }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.product.name} — Embrowerment®` },
    { name: "description", content: loaderData.product.description.slice(0, 160) },
    ...(loaderData.product.images[0] ? [{ property: "og:image", content: loaderData.product.images[0] }] : []),
  ] : [] }),
  component: ProductPage,
});

function ProductPage() {
  const { product: p, related } = Route.useLoaderData();
  const { add } = useStore();
  const [img, setImg] = useState(0);
  const firstIn = p.variants.find(v => v.inStock)?.name ?? p.variants[0]?.name;
  const [variant, setVariant] = useState<string | undefined>(firstIn);
  const [qty, setQty] = useState(1);
  const v = p.variants.find(x => x.name === variant);
  const inStock = p.variants.length ? !!v?.inStock : p.inStock;
  const sections = [{ title: "Description", body: p.description }, ...p.sections].filter(s => s.body);
  return <>
    <section className="pdp" key={p.id}>
      <div className="pdp-gallery">
        {p.images.length > 1 && <div className="pdp-thumbs">{p.images.map((src, i) => <button key={src} className={i === img ? "on" : ""} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}><SafeImg src={src} alt="" /></button>)}</div>}
        <div className="pdp-img"><SafeImg key={img} src={p.images[img]} alt={p.name} />{p.comingSoon && <span className="tag">Coming soon</span>}</div>
      </div>
      <div className="pdp-info">
        <nav className="crumbs"><Link to="/">Home</Link> › <Link to="/shop">Shop</Link> › <span>{p.name}</span></nav>
        <h1>{p.name}</h1>
        <p className="pdp-price">{p.compareAtPrice ? <s>{money(p.compareAtPrice)}</s> : null}{money(p.price)}</p>
        {p.tagline && <p className="pdp-tag">{p.tagline}</p>}
        {p.comingSoon && <p className="notice">Coming soon — this product isn't available to order yet. Check back shortly or follow <a href="https://www.instagram.com/embrowerment" target="_blank" rel="noreferrer">@embrowerment</a> for the launch.</p>}
        {!p.comingSoon && p.variants.length > 0 && <div className="pdp-opt">
          <p className="eyebrow">{p.variantLabel} — <span className="muted-t">{variant}</span></p>
          <div className="chips">{p.variants.map(x => <button key={x.name} className={`${variant === x.name ? "on" : ""}${x.inStock ? "" : " out"}`} onClick={() => setVariant(x.name)} aria-pressed={variant === x.name}>{x.name}</button>)}</div>
        </div>}
        {p.comingSoon ? <div className="pdp-buy"><button className="btn-solid" disabled>Coming soon</button></div> : <div className="pdp-buy">
          <div className="qty"><button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button><span>{qty}</span><button onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Increase">+</button></div>
          <button className="btn-solid" disabled={!inStock} onClick={() => add({ kind: "product", ref: p.id, variant, qty })}>{inStock ? "Add To Bag" : "Sold out"}</button>
        </div>}
        <WishButton kind="product" id={p.id} />
        {sections.length > 0 && <div className="pdp-acc"><h2 className="pdp-acc-h">Product Information</h2>
          <Accordion items={sections.map(s => ({ q: s.title, a: <>{s.body.split(/\n{1,}/).map((t, i) => <p key={i}>{t}</p>)}</> }))} /></div>}
      </div>
    </section>
    {related.length > 0 && <section className="feat">
      <div className="feat-head wide"><h2 className="h-display">You may also like</h2></div>
      <div className="pgrid four">{related.map(r => <ProductCard key={r.id} p={r} />)}</div>
    </section>}
  </>;
}