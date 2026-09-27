import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { IMG, LINKS } from "./data";
import { useStore } from "./store";

const nav = [
  ["The Method", LINKS.method],
  ["Permanent makeup", LINKS.pmu],
  ["Shop", "/shop"],
  ["Academy", "/academy"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, count, setDrawer } = useStore();
  const path = useRouterState({ select: s => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  return <>
    <header className="hdr">
      <Link to="/" className="hdr-logo" aria-label="Embrowerment home"><img src={IMG.logo} alt="Embrowerment" /></Link>
      <nav className="hdr-nav">{nav.map(([l, h]) => <Link key={l} to={h} activeProps={{ className: "active" }}>{l}</Link>)}<span>Foundation</span></nav>
      <div className="hdr-util">
        <Link to={user ? "/account" : "/login"} className="hide-sm">{user ? "Account" : "Login Account"}</Link>
        <button className="hdr-cart" onClick={() => setDrawer(true)} aria-label={`Cart, ${count} items`}>Cart ({count})</button>
        <button className="hdr-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 8h18M3 16h18" />}</svg>
        </button>
      </div>
    </header>
    <div className={`hdr-drawer${open ? " open" : ""}`}>
      {nav.map(([l, h]) => <Link key={l} to={h}>{l}</Link>)}
      <span>Foundation</span>
      <Link to={user ? "/account" : "/login"}>{user ? "Account" : "Login Account"}</Link>
      {user && <Link to="/wishlist">Wishlist</Link>}
    </div>
  </>;
}
