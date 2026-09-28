import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-B9SM6Hvl.js
var $$splitComponentImporter = () => import("./reset-password-iE0JTkQ6.mjs");
var Route = createFileRoute("/reset-password")({
	validateSearch: (s) => ({
		token: typeof s["token"] === "string" ? s["token"] : "",
		email: typeof s["email"] === "string" ? s["email"] : ""
	}),
	head: () => ({ meta: [{ title: "Choose a new password — Embrowerment®" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
