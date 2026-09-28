import { r as __toESM } from "../_runtime.mjs";
import { i as money } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WishButton } from "./commerce-BxIj5Hkx.mjs";
import { t as Accordion } from "./ui-BmJeMTMK.mjs";
import { t as ProductCard } from "./shop.index-DUBiTXKC.mjs";
import { t as Route } from "./shop._slug-BqUls0kY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop._slug-CmyVoH_S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { product: p, related } = Route.useLoaderData();
	const { add } = useStore();
	const [img, setImg] = (0, import_react.useState)(0);
	const firstIn = p.variants.find((v) => v.inStock)?.name ?? p.variants[0]?.name;
	const [variant, setVariant] = (0, import_react.useState)(firstIn);
	const [qty, setQty] = (0, import_react.useState)(1);
	const v = p.variants.find((x) => x.name === variant);
	const inStock = p.variants.length ? !!v?.inStock : p.inStock;
	const sections = [{
		title: "Description",
		body: p.description
	}, ...p.sections].filter((s) => s.body);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "pdp",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pdp-gallery",
			children: [p.images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pdp-thumbs",
				children: p.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: i === img ? "on" : "",
					onClick: () => setImg(i),
					"aria-label": `Image ${i + 1}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
						src,
						alt: ""
					})
				}, src))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pdp-img",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
					src: p.images[img],
					alt: p.name
				}, img), p.comingSoon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tag",
					children: "Coming soon"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pdp-info",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "crumbs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Home"
						}),
						" › ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: "Shop"
						}),
						" › ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: p.name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pdp-price",
					children: [p.compareAtPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("s", { children: money(p.compareAtPrice) }) : null, money(p.price)]
				}),
				p.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pdp-tag",
					children: p.tagline
				}),
				p.comingSoon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "notice",
					children: [
						"Coming soon — this product isn't available to order yet. Check back shortly or follow ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://www.instagram.com/embrowerment",
							target: "_blank",
							rel: "noreferrer",
							children: "@embrowerment"
						}),
						" for the launch."
					]
				}),
				!p.comingSoon && p.variants.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pdp-opt",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [
							p.variantLabel,
							" — ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "muted-t",
								children: variant
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chips",
						children: p.variants.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `${variant === x.name ? "on" : ""}${x.inStock ? "" : " out"}`,
							onClick: () => setVariant(x.name),
							"aria-pressed": variant === x.name,
							children: x.name
						}, x.name))
					})]
				}),
				p.comingSoon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pdp-buy",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-solid",
						disabled: true,
						children: "Coming soon"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pdp-buy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "qty",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setQty((q) => Math.max(1, q - 1)),
								"aria-label": "Decrease",
								children: "−"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: qty }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setQty((q) => Math.min(99, q + 1)),
								"aria-label": "Increase",
								children: "+"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-solid",
						disabled: !inStock,
						onClick: () => add({
							kind: "product",
							ref: p.id,
							variant,
							qty
						}),
						children: inStock ? "Add To Bag" : "Sold out"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishButton, {
					kind: "product",
					id: p.id
				}),
				sections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pdp-acc",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "pdp-acc-h",
						children: "Product Information"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, { items: sections.map((s) => ({
						q: s.title,
						a: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: s.body.split(/\n{1,}/).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t }, i)) })
					})) })]
				})
			]
		})]
	}, p.id), related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "feat-head wide",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "h-display",
				children: "You may also like"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pgrid four",
			children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p: r }, r.id))
		})]
	})] });
}
//#endregion
export { ProductPage as component };
