import { r as api } from "./api-CjIkjKHh.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CVNBYQ9K.js
var $$splitComponentImporter = () => import("./routes-D2vX9Fjp.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Embrowerment® — Confidence begins in the eye zone" },
		{
			name: "description",
			content: "Embrowerment® — a method for brows, a mindset for life. The Method, permanent makeup, products and academy by Umbreen Sheikh."
		},
		{
			property: "og:title",
			content: "Embrowerment®"
		},
		{
			property: "og:description",
			content: "Confidence begins in the eye zone. A method for brows - a mindset for life."
		},
		{
			property: "og:image",
			content: "/images/hero.webp"
		}
	] }),
	loader: () => api("/products").then((d) => d.products).catch(() => []),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
