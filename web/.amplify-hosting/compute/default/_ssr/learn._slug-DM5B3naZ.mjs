import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn._slug-DM5B3naZ.js
var $$splitComponentImporter = () => import("./learn._slug-4KHbGqAr.mjs");
var Route = createFileRoute("/learn/$slug")({
	validateSearch: (s) => ({ lesson: typeof s["lesson"] === "string" ? s["lesson"] : void 0 }),
	head: () => ({ meta: [{ title: "Course — Embrowerment® Academy" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
