import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { api, money, type Line, type Quote } from "@/lib/api";
import { useStore } from "./store";
import { SafeImg } from "./SafeImg";

const sameLine = (l: Line, i: { kind: string; ref: string; variant: string }) => l.kind === i.kind && l.ref === String(i.ref) && (l.variant || "") === (i.variant || "");

export function WishButton({ kind, id, label = true }: { kind: Line["kind"]; id: string; label?: boolean }) {
  const { user, wish, toggleWish } = useStore(); const nav = useNavigate();
  const saved = wish.has(`${kind}:${id}`);
  const onClick = async () => {
    if (!user) { nav({ to: "/login", search: { next: typeof window !== "undefined" ? window.location.pathname : "/" } }); return; }
    await toggleWish(kind, id);
  };
  return <button type="button" className={`wish${saved ? " on" : ""}`} onClick={onClick} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
    {label && <span>{saved ? "Saved" : "Wishlist"}</span>}
  </button>;
}

export function CouponBox() {
  const { coupon, setCoupon, quote } = useStore();
  const [code, setCode] = useState(coupon);
  useEffect(() => setCode(coupon), [coupon]);
  const apply = (e: FormEvent) => { e.preventDefault(); setCoupon(code.trim().toUpperCase()); };
  if (quote?.coupon) return <div className="coupon applied"><span><b>{quote.coupon.code}</b> applied{quote.coupon.description && ` — ${quote.coupon.description}`}</span><button className="link" onClick={() => setCoupon("")}>Remove</button></div>;
  return <form className="coupon" onSubmit={apply}>
    <input value={code} onChange={e => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" />
    <button className="btn-mono" type="submit" disabled={!code.trim()}>Apply</button>
    {coupon && quote?.couponError && <p className="form-error">{quote.couponError}</p>}
  </form>;
}

export function Totals({ q }: { q: Quote }) {
  return <dl className="totals">
    <dt>Subtotal</dt><dd>{money(q.subtotal)}</dd>
    {q.discount > 0 && <><dt>Discount</dt><dd>−{money(q.discount)}</dd></>}
    {q.requiresShipping && <><dt>Shipping</dt><dd>{q.shipping ? money(q.shipping) : "Free"}</dd></>}
    {q.tax > 0 && <><dt>Tax</dt><dd>{money(q.tax)}</dd></>}
    <dt className="t">Total</dt><dd className="t">{money(q.total)}</dd>
  </dl>;
}

export function useCheckout() {
  const { user, lines, coupon, quote } = useStore(); const nav = useNavigate();
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const go = async () => {
    setError("");
    if (!user) { nav({ to: "/login", search: { next: "/cart" } }); return; }
    setBusy(true);
    try { const d = await api<{ url: string }>("/checkout", { body: { items: lines, coupon: quote?.coupon ? coupon : undefined } }); window.location.href = d.url; }
    catch (e) { setError((e as Error).message); setBusy(false); }
  };
  return { go, busy, error };
}

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { lines, quote, setQty, remove, setDrawer } = useStore();
  if (!quote) return null;
  return <ul className={`cart-lines${compact ? " compact" : ""}`}>
    {quote.items.map(it => {
      const i = lines.findIndex(l => sameLine(l, it));
      const href = it.kind === "product" ? `/shop/${it.slug}` : `/academy/${it.slug}`;
      return <li key={`${it.kind}${it.ref}${it.variant}`}>
        <Link to={href as "/"} onClick={() => setDrawer(false)} className="cl-img"><SafeImg src={it.image} alt="" /></Link>
        <div className="cl-body">
          <Link to={href as "/"} onClick={() => setDrawer(false)}><b>{it.name}</b></Link>
          <small>{it.kind === "course" ? "Online course" : it.variant}</small>
          {!it.inStock && <small className="form-error">Out of stock</small>}
          <div className="cl-actions">
            {it.kind === "product" ? <div className="qty"><button onClick={() => setQty(i, it.qty - 1)} aria-label="Decrease">−</button><span>{it.qty}</span><button onClick={() => setQty(i, it.qty + 1)} aria-label="Increase">+</button></div> : <span />}
            <button className="link" onClick={() => remove(i)}>Remove</button>
          </div>
        </div>
        <span className="cl-price">{money(it.price * it.qty)}</span>
      </li>;
    })}
    {quote.problems.filter(p => !quote.items.some(i => String(i.ref) === String(p.ref) && i.inStock === false)).map((p, k) => <li className="problem" key={k}><span className="form-error">{p.message}</span>
      <button className="link" onClick={() => { const i = lines.findIndex(l => l.ref === String(p.ref)); if (i >= 0) remove(i); }}>Remove</button></li>)}
  </ul>;
}

export function CartDrawer() {
  const { drawer, setDrawer, lines, quote, quoting, count } = useStore();
  const path = useRouterState({ select: s => s.location.pathname });
  useEffect(() => { setDrawer(false); }, [path, setDrawer]);
  const { go, busy, error } = useCheckout();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [setDrawer]);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);
  const blocked = !!quote?.problems.length;
  return <>
    <div className={`scrim${drawer ? " open" : ""}`} onClick={() => setDrawer(false)} />
    <aside className={`drawer${drawer ? " open" : ""}`} aria-hidden={!drawer} aria-label="Shopping bag" inert={!drawer}>
      <div className="drawer-head"><h2>Your bag ({count})</h2><button onClick={() => setDrawer(false)} aria-label="Close">✕</button></div>
      {!lines.length ? <div className="drawer-empty"><p>Your bag is empty.</p><Link to="/shop" className="more" onClick={() => setDrawer(false)}>Shop the collection <span aria-hidden="true">→</span></Link></div> : <>
        <div className="drawer-scroll">{quote ? <CartLines compact /> : <p className="muted pad">Loading…</p>}</div>
        {quote && <div className="drawer-foot">
          <CouponBox />
          <Totals q={quote} />
          {error && <p className="form-error">{error}</p>}
          <button className="btn-solid" onClick={go} disabled={busy || quoting || blocked}>{busy ? "Redirecting to checkout…" : "Checkout"}</button>
          <Link to="/cart" className="link center" onClick={() => setDrawer(false)}>View bag</Link>
        </div>}
      </>}
    </aside>
  </>;
}
