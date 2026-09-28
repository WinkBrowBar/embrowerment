import { r as __toESM } from "../_runtime.mjs";
import { n as ApiError, r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./learn._slug-DM5B3naZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn._slug-4KHbGqAr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function embed(url) {
	const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
	if (yt) return {
		type: "iframe",
		src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`
	};
	const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	if (vm) return {
		type: "iframe",
		src: `https://player.vimeo.com/video/${vm[1]}`
	};
	return url ? {
		type: "video",
		src: url
	} : null;
}
function Learn() {
	const { slug } = Route.useParams();
	const { lesson } = Route.useSearch();
	const { user, ready } = useStore();
	const nav = useNavigate();
	const [c, setC] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		(user ? api(`/courses/${slug}/learn`).catch((e) => {
			if (e instanceof ApiError && e.status === 403) return api(`/courses/${slug}`);
			throw e;
		}) : api(`/courses/${slug}`)).then((d) => setC(d.course)).catch((e) => setErr(e.message));
	}, [
		slug,
		user,
		ready
	]);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "phero phero--text",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "phero-text",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "h-display",
				children: "Course"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "phero-body",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: err })
			})]
		})
	});
	if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "phero phero--text",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "phero-text",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted",
				children: "Loading…"
			})
		})
	});
	const playable = c.lessons.filter((l) => c.owned || l.preview);
	const cur = c.lessons.find((l) => l.id === lesson && (c.owned || l.preview)) || playable[0];
	const media = cur?.videoUrl ? embed(cur.videoUrl) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "learn",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "learn-main",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "crumbs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/academy",
							children: "Academy"
						}),
						" › ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/academy/$slug",
							params: { slug: c.slug },
							children: c.title
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "player",
					children: [
						media?.type === "iframe" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							src: media.src,
							title: cur?.title,
							allow: "autoplay; fullscreen; picture-in-picture",
							allowFullScreen: true
						}),
						media?.type === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: media.src,
							controls: true,
							playsInline: true
						}),
						!media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "player-empty",
							children: cur ? "Video coming soon." : "Purchase this course to start learning."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: cur?.title || c.title }),
				cur?.content && cur.content.split(/\n+/).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t }, i)),
				!c.owned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "notice",
					children: [
						"You're watching a free preview. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/academy/$slug",
							params: { slug: c.slug },
							children: "Purchase the course"
						}),
						" to unlock every lesson."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "learn-side",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: c.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "lessons",
				children: c.lessons.map((l, i) => {
					const open = c.owned || l.preview;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cur?.id === l.id ? "on" : "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "n",
								children: String(i + 1).padStart(2, "0")
							}),
							open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "t link-plain",
								onClick: () => nav({
									to: "/learn/$slug",
									params: { slug },
									search: { lesson: l.id }
								}),
								children: l.title
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "t muted-t",
								children: ["🔒 ", l.title]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "muted-t",
								children: l.durationMin ? `${l.durationMin}m` : ""
							})
						]
					}, l.id);
				})
			})]
		})]
	});
}
//#endregion
export { Learn as component };
