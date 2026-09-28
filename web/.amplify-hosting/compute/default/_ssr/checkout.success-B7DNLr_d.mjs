import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.success-B7DNLr_d.js
var $$splitComponentImporter = () => import("./checkout.success-sRfgUXBO.mjs");
var Route = createFileRoute("/checkout/success")({
	validateSearch: (s) => ({ session_id: typeof s["session_id"] === "string" ? s["session_id"] : "" }),
	head: () => ({ meta: [{ title: "Thank you — Embrowerment®" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
