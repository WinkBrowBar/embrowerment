import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as CONCIERGE } from "./data-DhdUlfnB.mjs";
import { i as PageHero } from "./ui-BmJeMTMK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/returns-Dvl1Z9HY.js
var import_jsx_runtime = require_jsx_runtime();
var mail = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
	href: `mailto:${CONCIERGE.email}?subject=Return%20request`,
	children: CONCIERGE.email
});
var TBD = ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
	className: "tbd",
	children
});
var SECTIONS = [
	{
		id: "eligibility",
		title: "Eligibility",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TBD, { children: "[Return window — e.g. number of days from delivery — and condition requirements for returned products.]" })
	},
	{
		id: "non-returnable",
		title: "Non-returnable items",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TBD, { children: "[Items that cannot be returned, e.g. opened skincare or used tools, for hygiene reasons.]" })
	},
	{
		id: "how-to",
		title: "How to start a return",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Email ",
			mail,
			" with your order number and the item(s) you would like to return. The Embrowerment® Concierge is available ",
			CONCIERGE.hours,
			"."
		] })
	},
	{
		id: "refunds",
		title: "Refunds",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TBD, { children: "[How and when refunds are issued, to which payment method, and whether shipping costs are refunded.]" })
	},
	{
		id: "exchanges",
		title: "Exchanges & damaged items",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TBD, { children: "[Process for exchanges, and for items that arrive damaged or incorrect.]" })
	},
	{
		id: "services",
		title: "Services",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Permanent makeup services, consultations and follow ups are covered by our ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/pmu-policies",
				children: "PMU Policies"
			}),
			", not this returns policy."
		] })
	}
];
function Returns() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		title: "Returns.",
		kicker: "Orders & Support",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Questions about an order? Contact the ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Embrowerment® Concierge" }),
			" · ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `tel:${CONCIERGE.tel}`,
				children: CONCIERGE.phone
			}),
			" · ",
			mail
		] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "doc",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "doc-toc",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: SECTIONS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: `#${s.id}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(i + 1).padStart(2, "0") }), s.title]
			}) }, s.id)) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "doc-body",
			children: SECTIONS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: s.id,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(i + 1).padStart(2, "0") }), s.title] }), s.body]
			}, s.id))
		})]
	})] });
}
//#endregion
export { Returns as component };
