import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Czzpn5zf.js
var $$splitComponentImporter = () => import("./login-DOJ7awYt.mjs");
var Route = createFileRoute("/login")({
	validateSearch: (s) => ({ next: typeof s["next"] === "string" ? s["next"] : void 0 }),
	head: () => ({ meta: [{ title: "Log in — Embrowerment®" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
