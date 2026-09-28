import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-ui-DvMDsNA6.js
var import_jsx_runtime = require_jsx_runtime();
function AuthShell({ title, sub, children, foot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "auth",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "auth-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "h-display",
					children: title
				}),
				sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lede",
					children: sub
				}),
				children,
				foot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "auth-foot",
					children: foot
				})
			]
		})
	});
}
/** Only allow same-site relative redirects. */
var safeNext = (n) => n && n.startsWith("/") && !n.startsWith("//") ? n : "/account";
//#endregion
export { safeNext as n, AuthShell as t };
