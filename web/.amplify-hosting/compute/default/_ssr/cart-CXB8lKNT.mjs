import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Totals, n as CartLines, o as useCheckout, r as CouponBox } from "./commerce-BxIj5Hkx.mjs";
import { t as Route } from "./cart-CJc_Nz3z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CXB8lKNT.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { lines, quote, quoting, user } = useStore();
	const { cancelled } = Route.useSearch();
	const { go, busy, error } = useCheckout();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat cart-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "h-display",
				children: "Your bag"
			}),
			cancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "notice",
				children: "Checkout was cancelled — your bag is saved."
			}),
			!lines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stack-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lede",
					children: "Your bag is empty."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "btn-solid",
						children: "Shop products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/academy",
						className: "btn-mono",
						children: "Browse courses"
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cart-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartLines, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Loading…"
				}) }), quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "summary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Summary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponBox, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Totals, { q: quote }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "form-error",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn-solid",
							onClick: go,
							disabled: busy || quoting || !!quote.problems.length,
							children: busy ? "Redirecting…" : user ? "Checkout" : "Log in to checkout"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "muted-t small",
							children: ["Secure payment by Stripe. ", quote.requiresShipping ? "Shipping address collected at checkout." : "Courses unlock instantly after payment."]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { CartPage as component };
