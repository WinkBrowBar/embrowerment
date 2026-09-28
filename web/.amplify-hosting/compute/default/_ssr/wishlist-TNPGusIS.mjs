import { r as __toESM } from "../_runtime.mjs";
import { r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CourseCard } from "./academy.index-DYMrdSwK.mjs";
import { r as useRequireUser } from "./account-CNjzSdQt.mjs";
import { t as ProductCard } from "./shop.index-DUBiTXKC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-TNPGusIS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Wishlist() {
	const user = useRequireUser();
	const { wish } = useStore();
	const [d, setD] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (user) api("/wishlist").then(setD);
	}, [user, wish]);
	const empty = d && !d.products.length && !d.courses.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "h-display page-title",
			children: "Wishlist"
		}), !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted",
			children: "Loading…"
		}) : empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "lede",
			children: ["Nothing saved yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "link",
				children: "Explore the shop"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [d.products.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pgrid",
			children: d.products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
		}), d.courses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "eyebrow section-gap",
			children: "Courses"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "courses",
			children: d.courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseCard, { c }, c.id))
		})] })] })]
	});
}
//#endregion
export { Wishlist as component };
