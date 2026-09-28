import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-Cjhmyca5.js
var $$splitComponentImporter = () => import("./register-IrQQtpmX.mjs");
var Route = createFileRoute("/register")({
	validateSearch: (s) => ({ next: typeof s["next"] === "string" ? s["next"] : void 0 }),
	head: () => ({ meta: [{ title: "Create account — Embrowerment®" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
