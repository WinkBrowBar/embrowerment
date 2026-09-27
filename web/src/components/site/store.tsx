import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, type Line, type Quote, type User } from "@/lib/api";

type Store = {
  user: User | null; ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; setUser: (u: User | null) => void;
  lines: Line[]; count: number;
  add: (l: Line) => void; setQty: (i: number, qty: number) => void; remove: (i: number) => void; clear: () => void;
  coupon: string; setCoupon: (c: string) => void;
  quote: Quote | null; quoting: boolean;
  drawer: boolean; setDrawer: (v: boolean) => void;
  wish: Set<string>; toggleWish: (kind: Line["kind"], ref: string) => Promise<boolean | null>;
  refreshUser: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);
const KEY = "emb-cart-v2";
const CKEY = "emb-coupon";
const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const same = (a: Line, b: Line) => a.kind === b.kind && a.ref === b.ref && (a.variant || "") === (b.variant || "");

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [coupon, setCouponS] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [wish, setWish] = useState<Set<string>>(new Set());
  const hydrated = useRef(false);

  const loadAccount = useCallback(async (u: User | null, guest: Line[]) => {
    if (!u) { setWish(new Set()); return; }
    const [c, w] = await Promise.all([
      guest.length ? api<{ items: Line[] }>("/cart/merge", { body: { items: guest } }) : api<{ items: Line[] }>("/cart"),
      api<{ ids: string[] }>("/wishlist"),
    ]);
    setLines(c.items); setWish(new Set(w.ids)); write(KEY, []);
  }, []);

  // Boot: session + local cart
  useEffect(() => {
    const guest = read<Line[]>(KEY, []);
    setCouponS(read<string>(CKEY, ""));
    api<{ user: User | null }>("/auth/me")
      .then(async ({ user }) => { setUser(user); if (user) await loadAccount(user, guest); else setLines(guest); })
      .catch(() => setLines(guest))
      .finally(() => { hydrated.current = true; setReady(true); });
  }, [loadAccount]);

  // Persist cart: server when logged in, localStorage for guests
  useEffect(() => {
    if (!hydrated.current) return;
    if (user) { const t = setTimeout(() => api("/cart", { method: "PUT", body: { items: lines } }).catch(() => {}), 400); return () => clearTimeout(t); }
    write(KEY, lines);
    return undefined;
  }, [lines, user]);

  // Price the cart (server is the source of truth for prices, stock and coupons)
  useEffect(() => {
    if (!hydrated.current) return;
    if (!lines.length) { setQuote(null); return; }
    let live = true; setQuoting(true);
    const t = setTimeout(() => api<Quote>("/cart/quote", { body: { items: lines, coupon: coupon || undefined } })
      .then(q => live && setQuote(q)).catch(() => {}).finally(() => live && setQuoting(false)), 150);
    return () => { live = false; clearTimeout(t); };
  }, [lines, coupon, user, ready]);

  const value = useMemo<Store>(() => ({
    user, ready, setUser,
    login: async (email, password) => { const guest = user ? [] : lines; const d = await api<{ user: User }>("/auth/login", { body: { email, password } }); setUser(d.user); await loadAccount(d.user, guest); },
    register: async (name, email, password) => { const guest = lines; const d = await api<{ user: User }>("/auth/register", { body: { name, email, password } }); setUser(d.user); await loadAccount(d.user, guest); },
    logout: async () => { await api("/auth/logout", { method: "POST" }); setUser(null); setLines([]); setWish(new Set()); },
    refreshUser: async () => { const d = await api<{ user: User | null }>("/auth/me"); setUser(d.user); if (d.user) await loadAccount(d.user, []); },
    lines, count: lines.reduce((n, l) => n + l.qty, 0),
    add: (l) => { setLines(ls => { const i = ls.findIndex(x => same(x, l)); if (i < 0) return [...ls, l]; if (l.kind === "course") return ls; return ls.map((x, j) => j === i ? { ...x, qty: Math.min(99, x.qty + l.qty) } : x); }); setDrawer(true); },
    setQty: (i, qty) => setLines(ls => qty <= 0 ? ls.filter((_, j) => j !== i) : ls.map((x, j) => j === i ? { ...x, qty: Math.min(99, qty) } : x)),
    remove: (i) => setLines(ls => ls.filter((_, j) => j !== i)),
    clear: () => setLines([]),
    coupon, setCoupon: (c) => { setCouponS(c); write(CKEY, c); },
    quote, quoting, drawer, setDrawer, wish,
    toggleWish: async (kind, ref) => {
      if (!user) return null;
      const d = await api<{ saved: boolean; ids: string[] }>("/wishlist/toggle", { body: { kind, ref } });
      setWish(new Set(d.ids)); return d.saved;
    },
  }), [user, ready, lines, coupon, quote, quoting, drawer, wish, loadAccount]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}
