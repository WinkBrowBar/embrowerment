import { r as __toESM } from "../_runtime.mjs";
import { r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DwHIc3eu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var KEY = "emb-cart-v2";
var CKEY = "emb-coupon";
var read = (k, d) => {
	try {
		const v = localStorage.getItem(k);
		return v ? JSON.parse(v) : d;
	} catch {
		return d;
	}
};
var write = (k, v) => {
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch {}
};
var same = (a, b) => a.kind === b.kind && a.ref === b.ref && (a.variant || "") === (b.variant || "");
function StoreProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [lines, setLines] = (0, import_react.useState)([]);
	const [coupon, setCouponS] = (0, import_react.useState)("");
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [quoting, setQuoting] = (0, import_react.useState)(false);
	const [drawer, setDrawer] = (0, import_react.useState)(false);
	const [wish, setWish] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const hydrated = (0, import_react.useRef)(false);
	const loadAccount = (0, import_react.useCallback)(async (u, guest) => {
		if (!u) {
			setWish(/* @__PURE__ */ new Set());
			return;
		}
		const [c, w] = await Promise.all([guest.length ? api("/cart/merge", { body: { items: guest } }) : api("/cart"), api("/wishlist")]);
		setLines(c.items);
		setWish(new Set(w.ids));
		write(KEY, []);
	}, []);
	(0, import_react.useEffect)(() => {
		const guest = read(KEY, []);
		setCouponS(read(CKEY, ""));
		api("/auth/me").then(async ({ user }) => {
			setUser(user);
			if (user) await loadAccount(user, guest);
			else setLines(guest);
		}).catch(() => setLines(guest)).finally(() => {
			hydrated.current = true;
			setReady(true);
		});
	}, [loadAccount]);
	(0, import_react.useEffect)(() => {
		if (!hydrated.current) return;
		if (user) {
			const t = setTimeout(() => api("/cart", {
				method: "PUT",
				body: { items: lines }
			}).catch(() => {}), 400);
			return () => clearTimeout(t);
		}
		write(KEY, lines);
	}, [lines, user]);
	(0, import_react.useEffect)(() => {
		if (!hydrated.current) return;
		if (!lines.length) {
			setQuote(null);
			return;
		}
		let live = true;
		setQuoting(true);
		const t = setTimeout(() => api("/cart/quote", { body: {
			items: lines,
			coupon: coupon || void 0
		} }).then((q) => live && setQuote(q)).catch(() => {}).finally(() => live && setQuoting(false)), 150);
		return () => {
			live = false;
			clearTimeout(t);
		};
	}, [
		lines,
		coupon,
		user,
		ready
	]);
	const value = (0, import_react.useMemo)(() => ({
		user,
		ready,
		setUser,
		login: async (email, password) => {
			const guest = user ? [] : lines;
			const d = await api("/auth/login", { body: {
				email,
				password
			} });
			setUser(d.user);
			await loadAccount(d.user, guest);
		},
		register: async (name, email, password) => {
			const guest = lines;
			const d = await api("/auth/register", { body: {
				name,
				email,
				password
			} });
			setUser(d.user);
			await loadAccount(d.user, guest);
		},
		logout: async () => {
			await api("/auth/logout", { method: "POST" });
			setUser(null);
			setLines([]);
			setWish(/* @__PURE__ */ new Set());
		},
		refreshUser: async () => {
			const d = await api("/auth/me");
			setUser(d.user);
			if (d.user) await loadAccount(d.user, []);
		},
		lines,
		count: lines.reduce((n, l) => n + l.qty, 0),
		add: (l) => {
			setLines((ls) => {
				const i = ls.findIndex((x) => same(x, l));
				if (i < 0) return [...ls, l];
				if (l.kind === "course") return ls;
				return ls.map((x, j) => j === i ? {
					...x,
					qty: Math.min(99, x.qty + l.qty)
				} : x);
			});
			setDrawer(true);
		},
		setQty: (i, qty) => setLines((ls) => qty <= 0 ? ls.filter((_, j) => j !== i) : ls.map((x, j) => j === i ? {
			...x,
			qty: Math.min(99, qty)
		} : x)),
		remove: (i) => setLines((ls) => ls.filter((_, j) => j !== i)),
		clear: () => setLines([]),
		coupon,
		setCoupon: (c) => {
			setCouponS(c);
			write(CKEY, c);
		},
		quote,
		quoting,
		drawer,
		setDrawer,
		wish,
		toggleWish: async (kind, ref) => {
			if (!user) return null;
			const d = await api("/wishlist/toggle", { body: {
				kind,
				ref
			} });
			setWish(new Set(d.ids));
			return d.saved;
		}
	}), [
		user,
		ready,
		lines,
		coupon,
		quote,
		quoting,
		drawer,
		wish,
		loadAccount
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useStore() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useStore must be used inside StoreProvider");
	return c;
}
//#endregion
export { useStore as n, StoreProvider as t };
