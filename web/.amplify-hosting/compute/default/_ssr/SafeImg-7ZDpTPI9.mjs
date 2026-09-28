import { r as __toESM } from "../_runtime.mjs";
import { t as API } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SafeImg-7ZDpTPI9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Resolves API-relative upload paths and shows a neutral placeholder instead of a broken-image icon. */
function SafeImg({ src, alt = "", className, ...rest }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const url = src?.startsWith("/uploads/") ? `${API}${src}` : src;
	if (!url || failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `img-ph${className ? ` ${className}` : ""}`,
		role: "img",
		"aria-label": alt,
		children: "EMBROWERMENT"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt,
		className,
		onError: () => setFailed(true),
		...rest
	});
}
//#endregion
export { SafeImg as t };
