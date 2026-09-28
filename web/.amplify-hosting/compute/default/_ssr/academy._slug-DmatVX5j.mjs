import { r as __toESM } from "../_runtime.mjs";
import { i as money, r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WishButton } from "./commerce-BxIj5Hkx.mjs";
import { t as Route } from "./academy._slug-ns5-wM2Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy._slug-DmatVX5j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoursePage() {
	const initial = Route.useLoaderData().course;
	const { user, add, lines } = useStore();
	const [c, setC] = (0, import_react.useState)(initial);
	(0, import_react.useEffect)(() => {
		setC(initial);
		if (user) api(`/courses/${initial.slug}`).then((d) => setC(d.course)).catch(() => {});
	}, [user, initial]);
	const inBag = lines.some((l) => l.kind === "course" && l.ref === c.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "pdp",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pdp-gallery",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pdp-img cover",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
					src: c.image,
					alt: c.title
				})
			})
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
							to: "/academy",
							children: "Academy"
						}),
						" › ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.title })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: c.title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pdp-price",
					children: money(c.price)
				}),
				c.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pdp-tag",
					children: c.summary
				}),
				c.description && c.description.split(/\n+/).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t }, i)),
				c.points.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "points",
					children: c.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: p }, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pdp-buy",
					children: c.owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/learn/$slug",
						params: { slug: c.slug },
						className: "btn-solid",
						children: "Start course"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-solid",
						onClick: () => add({
							kind: "course",
							ref: c.id,
							qty: 1
						}),
						children: inBag ? "In your bag" : "Purchase Course"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishButton, {
					kind: "course",
					id: c.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pdp-acc",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "pdp-acc-h",
						children: [
							c.lessonCount,
							" lesson",
							c.lessonCount === 1 ? "" : "s",
							c.totalMinutes ? ` · ${c.totalMinutes} min` : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "lessons",
						children: c.lessons.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "n",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "t",
								children: l.title
							}),
							l.preview && !c.owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/learn/$slug",
								params: { slug: c.slug },
								search: { lesson: l.id },
								className: "link",
								children: "Preview"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "muted-t",
								children: l.durationMin ? `${l.durationMin} min` : ""
							})
						] }, l.id))
					})]
				})
			]
		})]
	});
}
//#endregion
export { CoursePage as component };
