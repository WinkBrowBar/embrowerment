import { n as ApiError, r as api } from "./api-CjIkjKHh.mjs";
import { M as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy._slug-ns5-wM2Q.js
var $$splitComponentImporter = () => import("./academy._slug-DmatVX5j.mjs");
var Route = createFileRoute("/academy/$slug")({
	loader: async ({ params }) => {
		try {
			return await api(`/courses/${params.slug}`);
		} catch (e) {
			if (e instanceof ApiError && e.status === 404) throw notFound();
			throw e;
		}
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.course.title} — Embrowerment® Academy` }, {
		name: "description",
		content: loaderData.course.summary || loaderData.course.title
	}] : [] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
