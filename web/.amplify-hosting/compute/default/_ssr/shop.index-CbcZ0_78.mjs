import { i as money } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WishButton } from "./commerce-BxIj5Hkx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop.index-CbcZ0_78.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ p }) {
	const { add } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "pcard",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pcard-img",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop/$slug",
						params: { slug: p.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
							src: p.images[0],
							alt: p.name,
							loading: "lazy"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pcard-wish",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishButton, {
							kind: "product",
							id: p.id,
							label: false
						})
					}),
					p.comingSoon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tag",
						children: "Coming soon"
					}) : !p.inStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tag",
						children: "Sold out"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pcard-meta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop/$slug",
					params: { slug: p.slug },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: p.name })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.compareAtPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("s", { children: money(p.compareAtPrice) }) : null, money(p.price)] })]
			}),
			p.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pcard-tag",
				children: p.tagline
			}),
			p.comingSoon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop/$slug",
				params: { slug: p.slug },
				className: "btn-mono",
				children: "Coming soon"
			}) : p.variants.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop/$slug",
				params: { slug: p.slug },
				className: "btn-mono",
				children: ["Choose ", p.variantLabel.toLowerCase() || "option"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn-mono",
				disabled: !p.inStock,
				onClick: () => add({
					kind: "product",
					ref: p.id,
					qty: 1
				}),
				children: p.inStock ? "Add to bag" : "Sold out"
			})
		]
	});
}
var SplitErrorComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
	className: "phero phero--text",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "phero-text",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "h-display",
			children: "Shop"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "phero-body",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The shop is temporarily unavailable. Please try again shortly." })
		})]
	})
});
//#endregion
export { ProductCard, SplitErrorComponent as errorComponent };
