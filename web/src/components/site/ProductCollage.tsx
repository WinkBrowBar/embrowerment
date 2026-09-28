import { Link } from "@tanstack/react-router";
import { money, type Product } from "@/lib/api";
import { SafeImg } from "./SafeImg";
import { useStore } from "./store";
import { IMG } from "./data";

function Tile({ p, feature = false }: { p: Product; feature?: boolean }) {
  const { add } = useStore();
  return <article className={`ctile${feature ? " feature" : ""}`}>
    <Link to="/shop/$slug" params={{ slug: p.slug }} className="ctile-img"><SafeImg src={p.images[0]} alt={p.name} loading="lazy" />{p.comingSoon && <span className="tag">Coming soon</span>}</Link>
    <div className="ctile-meta">
      <div><Link to="/shop/$slug" params={{ slug: p.slug }}><h3>{p.name}</h3></Link>{(feature || p.tagline) && <p>{p.tagline}</p>}</div>
      <span>{money(p.price)}</span>
    </div>
    <div className="ctile-cta">
      {p.comingSoon ? <Link to="/shop/$slug" params={{ slug: p.slug }} className="btn-mono">Coming soon</Link> : p.variants.length ? <Link to="/shop/$slug" params={{ slug: p.slug }} className="btn-mono">Choose {p.variantLabel.toLowerCase() || "option"}</Link>
        : <button className={feature ? "btn-solid" : "btn-mono"} disabled={!p.inStock} onClick={() => add({ kind: "product", ref: p.id, qty: 1 })}>{p.inStock ? (feature ? "Add to bag" : "Add") : "Sold out"}</button>}
    </div>
  </article>;
}

/** Editorial product collage for the home page: lifestyle · featured product · product grid. */
export function ProductCollage({ products }: { products: Product[] }) {
  const feature = products.find(p => p.featured && !p.variants.length) || products[0];
  if (!feature) return null;
  const rest = products.filter(p => p.id !== feature.id);
  const top = rest.slice(0, 4), bottom = rest.slice(4, 7);
  return <div className="collage">
    <figure className="clife tall"><img src={IMG.products1} alt="Woman with a glowing natural makeup look" loading="lazy" />
      <figcaption><span className="eyebrow">The Collection</span><b>Essentials for the eye zone.</b><Link to="/shop" className="more">Shop all <span aria-hidden="true">→</span></Link></figcaption></figure>
    <Tile p={feature} feature />
    <div className="cgrid">{top.map(p => <Tile key={p.id} p={p} />)}</div>
    {bottom.length > 0 && <div className="cstrip">
      {bottom.map(p => <Tile key={p.id} p={p} />)}
      <figure className="clife wide"><img src={IMG.products3} alt="Portrait in a coffee shop" loading="lazy" />
        <figcaption><span className="eyebrow">Brows · Skin · Tools</span><b>Made to extend the Method beyond the chair.</b></figcaption></figure>
    </div>}
  </div>;
}