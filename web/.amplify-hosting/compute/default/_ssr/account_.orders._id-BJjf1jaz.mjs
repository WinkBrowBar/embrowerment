import { i as money } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account_.orders._id-BJjf1jaz.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./account_.orders._id-hAnEFNNj.mjs");
var Route = createFileRoute("/account_/orders/$id")({
	head: () => ({ meta: [{ title: "Order — Embrowerment®" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function OrderView({ o }) {
	const a = o.shippingAddress;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "order-view",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "cart-lines",
				children: o.items.map((i, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cl-img",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
							src: i.image,
							alt: ""
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cl-body",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [i.kind === "course" ? "Online course" : i.variant, i.qty > 1 ? ` · Qty ${i.qty}` : ""] }),
							i.kind === "course" && [
								"paid",
								"delivered",
								"processing",
								"shipped"
							].includes(o.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/account",
								search: { tab: "courses" },
								className: "link small",
								children: "Go to course"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cl-price",
						children: money(i.price * i.qty)
					})
				] }, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "totals",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Subtotal" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: money(o.subtotal) }),
					o.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: ["Discount", o.coupon ? ` (${o.coupon.code})` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: ["−", money(o.discount)] })] }),
					o.shipping > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: money(o.shipping) })] }),
					o.tax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tax" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: money(o.tax) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "t",
						children: "Total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "t",
						children: money(o.total)
					})
				]
			}),
			a?.line1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ship",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "eyebrow",
						children: "Shipping to"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						a.name,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						a.line1,
						a.line2 ? `, ${a.line2}` : "",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						a.city,
						", ",
						a.state,
						" ",
						a.postal_code,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						a.country
					] }),
					o.trackingNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Tracking: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: o.trackingNumber })] })
				]
			})
		]
	});
}
//#endregion
export { Route as n, OrderView as t };
