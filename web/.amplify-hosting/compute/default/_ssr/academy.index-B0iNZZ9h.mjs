import { r as __toESM } from "../_runtime.mjs";
import { i as money, r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WishButton } from "./commerce-BxIj5Hkx.mjs";
import { n as IMG } from "./data-DhdUlfnB.mjs";
import { i as PageHero } from "./ui-BmJeMTMK.mjs";
import { n as Route } from "./academy.index-DYMrdSwK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy.index-B0iNZZ9h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Re-fetch on the client so "owned" reflects the signed-in user. */
function useOwnedCourses(initial) {
	const { user } = useStore();
	const [list, setList] = (0, import_react.useState)(initial);
	(0, import_react.useEffect)(() => {
		if (user) api("/courses").then((d) => setList(d.courses)).catch(() => {});
		else setList(initial);
	}, [user, initial]);
	return list;
}
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
function Academy() {
	const courses = useOwnedCourses(Route.useLoaderData().courses);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		title: "Academy .",
		image: IMG.academy,
		alt: "Close-up of an eye and a defined brow"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "feat",
		children: courses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "courses",
			children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseCard, { c }, c.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted",
			children: "No courses yet."
		})
	})] });
}
//#endregion
export { CourseCard, Academy as component, useOwnedCourses };
