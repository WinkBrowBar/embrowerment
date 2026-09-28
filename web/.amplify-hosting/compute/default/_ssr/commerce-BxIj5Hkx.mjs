import { r as __toESM } from "../_runtime.mjs";
import { i as money, r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-BxIj5Hkx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sameLine = (l, i) => l.kind === i.kind && l.ref === String(i.ref) && (l.variant || "") === (i.variant || "");
function WishButton({ kind, id, label = true }) {
	const { user, wish, toggleWish } = useStore();
	const nav = useNavigate();
	const saved = wish.has(`${kind}:${id}`);
	const onClick = async () => {
		if (!user) {
			nav({
				to: "/login",
				search: { next: typeof window !== "undefined" ? window.location.pathname : "/" }
			});
			return;
		}
		await toggleWish(kind, id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: `wish${saved ? " on" : ""}`,
		onClick,
		"aria-pressed": saved,
		"aria-label": saved ? "Remove from wishlist" : "Save to wishlist",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			width: "18",
			height: "18",
			fill: saved ? "currentColor" : "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" })
		}), label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saved ? "Saved" : "Wishlist" })]
	});
}
function CouponBox() {
	const { coupon, setCoupon, quote } = useStore();
	const [code, setCode] = (0, import_react.useState)(coupon);
	(0, import_react.useEffect)(() => setCode(coupon), [coupon]);
	const apply = (e) => {
		e.preventDefault();
		setCoupon(code.trim().toUpperCase());
	};
	if (quote?.coupon) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "coupon applied",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: quote.coupon.code }),
			" applied",
			quote.coupon.description && ` — ${quote.coupon.description}`
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "link",
			onClick: () => setCoupon(""),
			children: "Remove"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "coupon",
		onSubmit: apply,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: code,
				onChange: (e) => setCode(e.target.value),
				placeholder: "Coupon code",
				"aria-label": "Coupon code"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn-mono",
				type: "submit",
				disabled: !code.trim(),
				children: "Apply"
			}),
			coupon && quote?.couponError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "form-error",
				children: quote.couponError
			})
		]
	});
}
function Totals({ q }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
		className: "totals",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Subtotal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: money(q.subtotal) }),
			q.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: ["−", money(q.discount)] })] }),
			q.requiresShipping && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: q.shipping ? money(q.shipping) : "Free" })] }),
			q.tax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tax" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: money(q.tax) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "t",
				children: "Total"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "t",
				children: money(q.total)
			})
		]
	});
}
function useCheckout() {
	const { user, lines, coupon, quote } = useStore();
	const nav = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const go = async () => {
		setError("");
		if (!user) {
			nav({
				to: "/login",
				search: { next: "/cart" }
			});
			return;
		}
		setBusy(true);
		try {
			const d = await api("/checkout", { body: {
				items: lines,
				coupon: quote?.coupon ? coupon : void 0
			} });
			window.location.href = d.url;
		} catch (e) {
			setError(e.message);
			setBusy(false);
		}
	};
	return {
		go,
		busy,
		error
	};
}
function CartLines({ compact = false }) {
	const { lines, quote, setQty, remove, setDrawer } = useStore();
	if (!quote) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: `cart-lines${compact ? " compact" : ""}`,
		children: [quote.items.map((it) => {
			const i = lines.findIndex((l) => sameLine(l, it));
			const href = it.kind === "product" ? `/shop/${it.slug}` : `/academy/${it.slug}`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: href,
					onClick: () => setDrawer(false),
					className: "cl-img",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
						src: it.image,
						alt: ""
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cl-body",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: href,
							onClick: () => setDrawer(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: it.name })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: it.kind === "course" ? "Online course" : it.variant }),
						!it.inStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
							className: "form-error",
							children: "Out of stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cl-actions",
							children: [it.kind === "product" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "qty",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setQty(i, it.qty - 1),
										"aria-label": "Decrease",
										children: "−"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.qty }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setQty(i, it.qty + 1),
										"aria-label": "Increase",
										children: "+"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "link",
								onClick: () => remove(i),
								children: "Remove"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cl-price",
					children: money(it.price * it.qty)
				})
			] }, `${it.kind}${it.ref}${it.variant}`);
		}), quote.problems.filter((p) => !quote.items.some((i) => String(i.ref) === String(p.ref) && i.inStock === false)).map((p, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "problem",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "form-error",
				children: p.message
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "link",
				onClick: () => {
					const i = lines.findIndex((l) => l.ref === String(p.ref));
					if (i >= 0) remove(i);
				},
				children: "Remove"
			})]
		}, k))]
	});
}
function CartDrawer() {
	const { drawer, setDrawer, lines, quote, quoting, count } = useStore();
	const path = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		setDrawer(false);
	}, [path, setDrawer]);
	const { go, busy, error } = useCheckout();
	(0, import_react.useEffect)(() => {
		const k = (e) => e.key === "Escape" && setDrawer(false);
		window.addEventListener("keydown", k);
		return () => window.removeEventListener("keydown", k);
	}, [setDrawer]);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = drawer ? "hidden" : "";
	}, [drawer]);
	const blocked = !!quote?.problems.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `scrim${drawer ? " open" : ""}`,
		onClick: () => setDrawer(false)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `drawer${drawer ? " open" : ""}`,
		"aria-hidden": !drawer,
		"aria-label": "Shopping bag",
		inert: !drawer,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "drawer-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
				"Your bag (",
				count,
				")"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setDrawer(false),
				"aria-label": "Close",
				children: "✕"
			})]
		}), !lines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "drawer-empty",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your bag is empty." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "more",
				onClick: () => setDrawer(false),
				children: ["Shop the collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: "→"
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "drawer-scroll",
			children: quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartLines, { compact: true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted pad",
				children: "Loading…"
			})
		}), quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "drawer-foot",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponBox, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Totals, { q: quote }),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "form-error",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn-solid",
					onClick: go,
					disabled: busy || quoting || blocked,
					children: busy ? "Redirecting to checkout…" : "Checkout"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cart",
					className: "link center",
					onClick: () => setDrawer(false),
					children: "View bag"
				})
			]
		})] })]
	})] });
}
//#endregion
export { WishButton as a, Totals as i, CartLines as n, useCheckout as o, CouponBox as r, CartDrawer as t };
