import "../_runtime.mjs";
import { i as money, r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WishButton } from "./commerce-BxIj5Hkx.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./academy.index-B0iNZZ9h.mjs");
var $$splitErrorComponentImporter = () => import("./academy.index-BRBhN0HD.mjs");
var Route = createFileRoute("/academy/")({
	loader: () => api("/courses"),
	head: () => ({ meta: [{ title: "Academy — Embrowerment®" }, {
		name: "description",
		content: "Online brow courses from the Embrowerment® Academy."
	}] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function CourseCard({ c }) {
	const { add } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "course reveal",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pcard-img",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/academy/$slug",
					params: { slug: c.slug },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
						src: c.image,
						alt: c.title,
						loading: "lazy"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pcard-wish",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishButton, {
						kind: "course",
						id: c.id,
						label: false
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-meta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/academy/$slug",
					params: { slug: c.slug },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: c.title })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "card-price",
					children: money(c.price)
				})]
			}),
			c.points.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: c.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: p }, p)) }),
			c.owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/learn/$slug",
				params: { slug: c.slug },
				className: "btn-solid",
				children: "Start course"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn-mono",
				onClick: () => add({
					kind: "course",
					ref: c.id,
					qty: 1
				}),
				children: "Purchase Course"
			})
		]
	});
}
//#endregion
export { Route as n, CourseCard as t };
