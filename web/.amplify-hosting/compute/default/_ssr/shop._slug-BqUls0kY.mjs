import { n as ApiError, r as api } from "./api-CjIkjKHh.mjs";
import { M as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop._slug-BqUls0kY.js
var $$splitComponentImporter = () => import("./shop._slug-CmyVoH_S.mjs");
var Route = createFileRoute("/shop/$slug")({
	loader: async ({ params }) => {
		try {
			return await api(`/products/${params.slug}`);
		} catch (e) {
			if (e instanceof ApiError && e.status === 404) throw notFound();
			throw e;
		}
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.product.name} — Embrowerment®` },
		{
			name: "description",
			content: loaderData.product.description.slice(0, 160)
		},
		...loaderData.product.images[0] ? [{
			property: "og:image",
			content: loaderData.product.images[0]
		}] : []
	] : [] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
