import { r as __toESM } from "../_runtime.mjs";
import { i as money, r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as statusLabel, r as useRequireUser } from "./account-CNjzSdQt.mjs";
import { n as Route } from "./account_.orders._id-BJjf1jaz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account_.orders._id-hAnEFNNj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function OrderPage() {
	const user = useRequireUser();
	const { id } = Route.useParams();
	const [o, setO] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (user) api(`/orders/${id}`).then((d) => setO(d.order)).catch((e) => setErr(e.message));
	}, [user, id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat account",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "crumbs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						search: { tab: "orders" },
						children: "Account"
					}),
					" › ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order" })
				]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "form-error",
				children: err
			}),
			o && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "account-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "h-display",
						children: ["Order ", o.number]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `status s-${o.status}`,
						children: statusLabel(o.status)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "muted-t",
					children: ["Placed ", new Date(o.createdAt).toLocaleString()]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderView, { o })
			] })
		]
	});
}
//#endregion
export { OrderView, OrderPage as component };
