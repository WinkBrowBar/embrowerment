import { r as __toESM } from "../_runtime.mjs";
import { r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as OrderView } from "./account_.orders._id-BJjf1jaz.mjs";
import { t as Route } from "./checkout.success-B7DNLr_d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.success-sRfgUXBO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Success() {
	const { session_id } = Route.useSearch();
	const { user, ready, clear } = useStore();
	const [o, setO] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)("");
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!ready || !user || !session_id || started.current) return;
		started.current = true;
		let tries = 0;
		let t;
		const poll = () => api(`/checkout/session/${session_id}`).then((d) => {
			setO(d.order);
			if (d.order.status === "pending" && ++tries < 10) t = setTimeout(poll, 2e3);
			else if (d.order.status !== "pending") clear();
		}).catch((e) => setErr(e.message));
		poll();
		return () => clearTimeout(t);
	}, [
		ready,
		user,
		session_id
	]);
	const pending = o?.status === "pending";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat account",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "eyebrow",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "h-display",
				children: err ? "We couldn't find that order" : pending || !o ? "Confirming your payment…" : "Thank you."
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "lede",
				children: [err, ". If you were charged, please contact the concierge at hello@embrowerment.com."]
			}),
			o && !pending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "lede",
				children: [
					"Order ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: o.number }),
					" is confirmed. A receipt is on its way to your inbox.",
					o.items.some((i) => i.kind === "course") ? " Your courses are ready in your account." : ""
				]
			}),
			o && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderView, { o }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account",
					search: { tab: o?.items.some((i) => i.kind === "course") ? "courses" : "orders" },
					className: "btn-solid",
					children: "Go to your account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "btn-mono",
					children: "Continue shopping"
				})]
			})
		]
	});
}
//#endregion
export { Success as component };
