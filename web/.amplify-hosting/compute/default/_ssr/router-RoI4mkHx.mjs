import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore, t as StoreProvider } from "./store-DwHIc3eu.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CartDrawer } from "./commerce-BxIj5Hkx.mjs";
import { t as Route$7 } from "./academy._slug-ns5-wM2Q.mjs";
import { n as IMG, r as LINKS } from "./data-DhdUlfnB.mjs";
import { n as Route$8 } from "./academy.index-DYMrdSwK.mjs";
import { t as Route$9 } from "./account-CNjzSdQt.mjs";
import { n as Route$10 } from "./account_.orders._id-BJjf1jaz.mjs";
import { t as Route$11 } from "./cart-CJc_Nz3z.mjs";
import { t as Route$12 } from "./checkout.success-B7DNLr_d.mjs";
import { t as Route$13 } from "./learn._slug-DM5B3naZ.mjs";
import { t as Route$14 } from "./login-Czzpn5zf.mjs";
import { t as Route$15 } from "./register-Cjhmyca5.mjs";
import { t as Route$16 } from "./reset-password-B9SM6Hvl.mjs";
import { t as Route$17 } from "./routes-CVNBYQ9K.mjs";
import { n as Route$18 } from "./shop.index-DUBiTXKC.mjs";
import { t as Route$19 } from "./shop._slug-BqUls0kY.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-RoI4mkHx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CkrZRFCm.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var nav = [
	["The Method", LINKS.method],
	["Permanent makeup", LINKS.pmu],
	["Shop", "/shop"],
	["Academy", "/academy"]
];
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { user, count, setDrawer } = useStore();
	const path = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => setOpen(false), [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "hdr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "hdr-logo",
				"aria-label": "Embrowerment home",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: IMG.logo,
					alt: "Embrowerment"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "hdr-nav",
				children: [nav.map(([l, h]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: h,
					activeProps: { className: "active" },
					children: l
				}, l)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Foundation" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hdr-util",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: user ? "/account" : "/login",
						className: "hide-sm",
						children: user ? "Account" : "Login Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "hdr-cart",
						onClick: () => setDrawer(true),
						"aria-label": `Cart, ${count} items`,
						children: [
							"Cart (",
							count,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "hdr-burger",
						"aria-label": "Menu",
						"aria-expanded": open,
						onClick: () => setOpen((o) => !o),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "24",
							height: "24",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.6",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 5l14 14M19 5L5 19" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 8h18M3 16h18" })
						})
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `hdr-drawer${open ? " open" : ""}`,
		children: [
			nav.map(([l, h]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: h,
				children: l
			}, l)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Foundation" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: user ? "/account" : "/login",
				children: user ? "Account" : "Login Account"
			}),
			user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/wishlist",
				children: "Wishlist"
			})
		]
	})] });
}
function Subscribe({ light = true }) {
	const [done, setDone] = (0, import_react.useState)(false);
	const onSubmit = (e) => {
		e.preventDefault();
		setDone(true);
	};
	return done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "sub-form sub-done",
		children: "Thank you!"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "sub-form",
		onSubmit,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "email",
			required: true,
			placeholder: "Email Address",
			"aria-label": "Email Address"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "submit",
			className: `btn-mono${light ? " light" : ""}`,
			children: "Sign Up"
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "ftr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ftr-grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Subscribe" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sign up with your email address to receive news and updates." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Subscribe, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sub-note",
							children: "We respect your privacy."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Orders & Support" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "gap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pmu-policies",
							children: "PMU Policies"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/returns",
							children: "Returns"
						}) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Embrowerment®" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: LINKS.winkBrowBar,
							target: "_blank",
							rel: "noreferrer",
							children: "Wink Brow Bar"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: LINKS.umbreen,
							target: "_blank",
							rel: "noreferrer",
							children: "Umbreen"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Foundation" })
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Follow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: LINKS.instagram,
							target: "_blank",
							rel: "noreferrer",
							children: "INSTAGRAM"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: LINKS.tiktok,
							children: "TIKTOK"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "FACEBOOK" })
					] })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "ftr-mark",
				viewBox: "0 0 1000 90",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "0",
					y: "89",
					fontSize: "122",
					fill: "currentColor",
					textLength: "1000",
					lengthAdjust: "spacing",
					children: "EMBROWERMENT"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ftr-legal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Embrowerment®. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confidence begins in the eye zone." })]
			})
		]
	});
}
function useReveal() {
	(0, import_react.useEffect)(() => {
		if (!("IntersectionObserver" in window)) {
			document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
			return;
		}
		const io = new IntersectionObserver((entries) => entries.forEach((en) => {
			if (en.isIntersecting) {
				en.target.classList.add("in");
				io.unobserve(en.target);
			}
		}), { rootMargin: "0px 0px -8% 0px" });
		const scan = (root) => root.querySelectorAll(".reveal:not(.in)").forEach((e) => io.observe(e));
		scan(document);
		const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => {
			if (!(n instanceof HTMLElement)) return;
			if (n.matches(".reveal:not(.in)")) io.observe(n);
			scan(n);
		})));
		mo.observe(document.body, {
			childList: true,
			subtree: true
		});
		return () => {
			io.disconnect();
			mo.disconnect();
		};
	}, []);
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "phero phero--text",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "phero-text",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "h-display",
					children: "Page not found."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "phero-body",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The page you're looking for doesn't exist or has been moved." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "more",
						children: ["Back home ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						})]
					})]
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Embrowerment®" },
			{
				name: "description",
				content: "Confidence begins in the eye zone."
			},
			{
				name: "author",
				content: "Umbreen Sheikh"
			},
			{
				property: "og:title",
				content: "Embrowerment®"
			},
			{
				property: "og:description",
				content: "Confidence begins in the eye zone."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Courier+Prime&family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {})
		] })
	});
}
function Reveal() {
	useReveal();
	return null;
}
var $$splitComponentImporter$5 = () => import("./forgot-password-BbK4h4qN.mjs");
var Route$5 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — Embrowerment®" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./method-WG4YcSvY.mjs");
var Route$4 = createFileRoute("/method")({
	head: () => ({ meta: [{ title: "The Method — Embrowerment®" }, {
		name: "description",
		content: "Explore Embrowerment® services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./permanent-makeup-9wjb8V5N.mjs");
var Route$3 = createFileRoute("/permanent-makeup")({
	head: () => ({ meta: [{ title: "Permanent Makeup — Embrowerment®" }, {
		name: "description",
		content: "Embrowerment® Advanced Semi-Permanent Makeup: nanoblading, microshading, ombre and hybrid brows, and eyeliner. Consultations personally conducted by Umbreen."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./pmu-policies-3bZvx6xh.mjs");
var Route$2 = createFileRoute("/pmu-policies")({
	head: () => ({ meta: [{ title: "PMU Policies — Embrowerment®" }, {
		name: "description",
		content: "Embrowerment® permanent makeup policies: cancellation, rescheduling, no-show, payment, CareCredit, refunds and follow-ups."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./returns-Dvl1Z9HY.mjs");
var Route$1 = createFileRoute("/returns")({
	head: () => ({ meta: [{ title: "Returns — Embrowerment®" }, {
		name: "description",
		content: "Embrowerment® returns and exchanges for product orders."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./wishlist-TNPGusIS.mjs");
var Route = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — Embrowerment®" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var AccountRoute = Route$9.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$6
});
var CartRoute = Route$11.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$6
});
var ForgotPasswordRoute = Route$5.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$6
});
var LoginRoute = Route$14.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$6
});
var MethodRoute = Route$4.update({
	id: "/method",
	path: "/method",
	getParentRoute: () => Route$6
});
var PermanentMakeupRoute = Route$3.update({
	id: "/permanent-makeup",
	path: "/permanent-makeup",
	getParentRoute: () => Route$6
});
var PmuPoliciesRoute = Route$2.update({
	id: "/pmu-policies",
	path: "/pmu-policies",
	getParentRoute: () => Route$6
});
var RegisterRoute = Route$15.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$6
});
var ResetPasswordRoute = Route$16.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$6
});
var ReturnsRoute = Route$1.update({
	id: "/returns",
	path: "/returns",
	getParentRoute: () => Route$6
});
var WishlistRoute = Route.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$6
});
var AcademyIndexRoute = Route$8.update({
	id: "/academy/",
	path: "/academy/",
	getParentRoute: () => Route$6
});
var AcademySlugRoute = Route$7.update({
	id: "/academy/$slug",
	path: "/academy/$slug",
	getParentRoute: () => Route$6
});
var CheckoutSuccessRoute = Route$12.update({
	id: "/checkout/success",
	path: "/checkout/success",
	getParentRoute: () => Route$6
});
var LearnSlugRoute = Route$13.update({
	id: "/learn/$slug",
	path: "/learn/$slug",
	getParentRoute: () => Route$6
});
var ShopIndexRoute = Route$18.update({
	id: "/shop/",
	path: "/shop/",
	getParentRoute: () => Route$6
});
var rootRouteChildren = {
	IndexRoute,
	AccountRoute,
	CartRoute,
	ForgotPasswordRoute,
	LoginRoute,
	MethodRoute,
	PermanentMakeupRoute,
	PmuPoliciesRoute,
	RegisterRoute,
	ResetPasswordRoute,
	ReturnsRoute,
	WishlistRoute,
	AcademySlugRoute,
	CheckoutSuccessRoute,
	LearnSlugRoute,
	ShopSlugRoute: Route$19.update({
		id: "/shop/$slug",
		path: "/shop/$slug",
		getParentRoute: () => Route$6
	}),
	AcademyIndexRoute,
	ShopIndexRoute,
	AccountOrdersIdRoute: Route$10.update({
		id: "/account_/orders/$id",
		path: "/account/orders/$id",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
