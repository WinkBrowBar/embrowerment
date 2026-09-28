import { i as money } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WishButton } from "./commerce-BxIj5Hkx.mjs";
import { n as IMG } from "./data-DhdUlfnB.mjs";
import { n as Route } from "./shop.index-DUBiTXKC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop.index-CDrBHhPe.js
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
function Shop() {
	const { products, categories } = Route.useLoaderData();
	const { category } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "shop-hero",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "reveal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "h-display",
				children: "Shop the Collection"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: "Discover essentials that bring confidence to your every day with intention."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: IMG.collection,
			alt: "Embrowerment® product collection"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "filters",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				search: {},
				className: !category ? "on" : "",
				children: "All"
			}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				search: { category: c },
				className: category === c ? "on" : "",
				children: c
			}, c))]
		}), products.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pgrid",
			children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted",
			children: "No products found."
		})]
	})] });
}
//#endregion
export { ProductCard, Shop as component };
