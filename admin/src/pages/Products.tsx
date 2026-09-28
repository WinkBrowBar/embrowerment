import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, money } from "../api";
import { Page, useLoad, Empty, Field, Toggle, ImageUpload, toast } from "../components/ui";

export function Products() {
  const { data, error } = useLoad(() => api("/admin/products"));
  return <Page title="Products" actions={<Link className="btn primary" to="/products/new">+ New product</Link>}>
    {error && <p className="error">{error}</p>}
    {data && (data.products.length ? <table className="table card"><thead><tr><th></th><th>Name</th><th>Category</th><th className="num">Price</th><th className="num">Stock</th><th>Status</th></tr></thead>
      <tbody>{data.products.map((p: any) => <tr key={p._id}>
        <td>{p.images[0] && <img className="mini" src={p.images[0]} alt="" />}</td>
        <td><Link to={`/products/${p._id}`}>{p.name}</Link>{p.featured && <span className="pill">Featured</span>}{p.comingSoon && <span className="pill">Coming soon</span>}</td><td>{p.category}</td><td className="num">{money(p.price)}</td>
        <td className="num">{!p.trackInventory ? "∞" : p.variants.length ? p.variants.reduce((n: number, v: any) => n + v.stock, 0) : p.stock}</td>
        <td>{p.active ? <span className="ok">Active</span> : <span className="muted">Hidden</span>}</td></tr>)}</tbody></table> : <Empty>No products yet.</Empty>)}
  </Page>;
}

const blank = { name: "", slug: "", tagline: "", description: "", price: 0, compareAtPrice: null, category: "Brows", images: [] as string[], variantLabel: "Shade", variants: [] as any[], stock: 0, trackInventory: true, sections: [] as any[], featured: false, comingSoon: false, active: true, sort: 0 };

export function ProductEdit() {
  const { id } = useParams(); const nav = useNavigate(); const isNew = id === "new";
  const [p, setP] = useState<any>(isNew ? blank : null); const [busy, setBusy] = useState(false);
  useEffect(() => { if (!isNew) api(`/admin/products/${id}`).then(d => setP(d.product)).catch(toast.err); }, [id, isNew]);
  if (!p) return <Page title="Product"><p className="muted">Loading…</p></Page>;
  const set = (k: string, v: unknown) => setP((x: any) => ({ ...x, [k]: v }));
  const setArr = (k: "variants" | "sections", i: number, f: string, v: unknown) => set(k, p[k].map((x: any, j: number) => j === i ? { ...x, [f]: v } : x));
  const save = async () => {
    setBusy(true);
    try {
      const body = { ...p, compareAtPrice: p.compareAtPrice || null }; delete body._id; delete body.createdAt; delete body.updatedAt; delete body.__v;
      const d = isNew ? await api("/admin/products", { body }) : await api(`/admin/products/${id}`, { method: "PUT", body });
      toast.ok("Product saved"); if (isNew) nav(`/products/${d.product._id}`, { replace: true }); else setP(d.product);
    } catch (e) { toast.err(e); } finally { setBusy(false); }
  };
  const del = async () => { if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return; try { await api(`/admin/products/${id}`, { method: "DELETE" }); toast.ok("Deleted"); nav("/products"); } catch (e) { toast.err(e); } };
  return <Page title={isNew ? "New product" : p.name} actions={<>{!isNew && <button className="btn danger" onClick={del}>Delete</button>}<button className="btn primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</button></>}>
    <div className="two wide-left">
      <div className="stack">
        <section className="card grid-form">
          <Field label="Name" wide><input value={p.name} onChange={e => set("name", e.target.value)} /></Field>
          <Field label="Tagline" wide><input value={p.tagline} onChange={e => set("tagline", e.target.value)} placeholder="e.g. Hydrating Concentrate" /></Field>
          <Field label="Description" wide><textarea rows={5} value={p.description} onChange={e => set("description", e.target.value)} /></Field>
          <Field label="Price (USD)"><input type="number" min="0" step="0.01" value={p.price} onChange={e => set("price", e.target.value)} /></Field>
          <Field label="Compare-at price" hint="Shown struck through"><input type="number" min="0" step="0.01" value={p.compareAtPrice ?? ""} onChange={e => set("compareAtPrice", e.target.value)} /></Field>
        </section>
        <section className="card"><h2>Images</h2><ImageUpload multiple value={p.images} onChange={v => set("images", v)} /></section>
        <section className="card">
          <div className="row-head"><h2>Variants</h2><button className="btn small" onClick={() => set("variants", [...p.variants, { name: "", sku: "", stock: 0 }])}>+ Add variant</button></div>
          {p.variants.length > 0 && <Field label="Variant label"><input value={p.variantLabel} onChange={e => set("variantLabel", e.target.value)} placeholder="Shade" /></Field>}
          {p.variants.length ? <table className="table edit"><thead><tr><th>Name</th><th>SKU</th><th>Stock</th><th /></tr></thead><tbody>{p.variants.map((v: any, i: number) => <tr key={i}>
            <td><input value={v.name} onChange={e => setArr("variants", i, "name", e.target.value)} /></td><td><input value={v.sku} onChange={e => setArr("variants", i, "sku", e.target.value)} /></td>
            <td><input type="number" min="0" value={v.stock} onChange={e => setArr("variants", i, "stock", e.target.value)} /></td>
            <td><button className="icon" onClick={() => set("variants", p.variants.filter((_: any, j: number) => j !== i))} aria-label="Remove">✕</button></td></tr>)}</tbody></table>
            : <Field label="Stock"><input type="number" min="0" value={p.stock} onChange={e => set("stock", e.target.value)} /></Field>}
        </section>
        <section className="card">
          <div className="row-head"><h2>Product page sections</h2><button className="btn small" onClick={() => set("sections", [...p.sections, { title: "", body: "" }])}>+ Add section</button></div>
          <p className="muted small">Shown as expandable panels on the product page (e.g. Clean Ingredients, Why You'll Love It, How To Apply).</p>
          {p.sections.map((s: any, i: number) => <div className="section-edit" key={i}>
            <input placeholder="Title" value={s.title} onChange={e => setArr("sections", i, "title", e.target.value)} />
            <textarea rows={3} placeholder="Content" value={s.body} onChange={e => setArr("sections", i, "body", e.target.value)} />
            <button className="icon" onClick={() => set("sections", p.sections.filter((_: any, j: number) => j !== i))} aria-label="Remove section">✕</button>
          </div>)}
        </section>
      </div>
      <div className="stack">
        <section className="card stack-sm">
          <Toggle checked={p.active} onChange={v => set("active", v)} label="Visible in store" />
          <Toggle checked={p.featured} onChange={v => set("featured", v)} label="Featured" />
          <Toggle checked={!!p.comingSoon} onChange={v => set("comingSoon", v)} label="Coming soon (visible, not purchasable)" />
          <Toggle checked={p.trackInventory} onChange={v => set("trackInventory", v)} label="Track inventory" />
        </section>
        <section className="card grid-form one">
          <Field label="Category"><input value={p.category} onChange={e => set("category", e.target.value)} list="cats" /><datalist id="cats"><option>Brows</option><option>Skin</option><option>Tools</option></datalist></Field>
          <Field label="URL slug" hint="Leave blank to generate from the name"><input value={p.slug} onChange={e => set("slug", e.target.value)} /></Field>
          <Field label="Sort order" hint="Lower shows first"><input type="number" value={p.sort} onChange={e => set("sort", e.target.value)} /></Field>
        </section>
      </div>
    </div>
  </Page>;
}