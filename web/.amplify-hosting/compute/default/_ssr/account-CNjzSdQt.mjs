import { r as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { _ as useNavigate, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-CNjzSdQt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var $$splitComponentImporter = () => import("./account-P8HIUa55.mjs");
var Route = createFileRoute("/account")({
	validateSearch: (s) => ({ tab: [
		"orders",
		"courses",
		"profile"
	].includes(s["tab"]) ? s["tab"] : void 0 }),
	head: () => ({ meta: [{ title: "Your account — Embrowerment®" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function useRequireUser() {
	const { user, ready } = useStore();
	const nav = useNavigate();
	(0, import_react.useEffect)(() => {
		if (ready && !user) nav({
			to: "/login",
			search: { next: window.location.pathname + window.location.search }
		});
	}, [
		ready,
		user,
		nav
	]);
	return ready && user ? user : null;
}
var statusLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);
//#endregion
export { statusLabel as n, useRequireUser as r, Route as t };
