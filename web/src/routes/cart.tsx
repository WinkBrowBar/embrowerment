import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, CartLines, CouponBox, Totals, useCheckout } from "@/components/site";

export const Route = createFileRoute("/cart")({
  validateSearch: (s: Record<string, unknown>): { cancelled?: number | undefined } => ({ cancelled: s["cancelled"] ? 1 : undefined }),
  head: () => ({ meta: [{ title: "Your bag — Embrowerment®" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const { lines, quote, quoting, user } = useStore();
  const { cancelled } = Route.useSearch();
  const { go, busy, error } = useCheckout();
  return <section className="feat cart-page">
    <h1 className="h-display">Your bag</h1>
    {cancelled && <p className="notice">Checkout was cancelled — your bag is saved.</p>}
    {!lines.length ? <div className="stack-lg"><p className="lede">Your bag is empty.</p><div className="row"><Link to="/shop" className="btn-solid">Shop products</Link><Link to="/academy" className="btn-mono">Browse courses</Link></div></div> :
      <div className="cart-grid">
        <div>{quote ? <CartLines /> : <p className="muted">Loading…</p>}</div>
        {quote && <aside className="summary">
          <h2>Summary</h2>
          <CouponBox />
          <Totals q={quote} />
          {error && <p className="form-error">{error}</p>}
          <button className="btn-solid" onClick={go} disabled={busy || quoting || !!quote.problems.length}>{busy ? "Redirecting…" : user ? "Checkout" : "Log in to checkout"}</button>
          <p className="muted-t small">Secure payment by Stripe. {quote.requiresShipping ? "Shipping address collected at checkout." : "Courses unlock instantly after payment."}</p>
        </aside>}
      </div>}
  </section>;
}
