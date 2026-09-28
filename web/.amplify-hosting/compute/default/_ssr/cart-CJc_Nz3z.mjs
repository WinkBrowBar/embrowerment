import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CJc_Nz3z.js
var $$splitComponentImporter = () => import("./cart-CXB8lKNT.mjs");
var Route = createFileRoute("/cart")({
	validateSearch: (s) => ({ cancelled: s["cancelled"] ? 1 : void 0 }),
	head: () => ({ meta: [{ title: "Your bag — Embrowerment®" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
