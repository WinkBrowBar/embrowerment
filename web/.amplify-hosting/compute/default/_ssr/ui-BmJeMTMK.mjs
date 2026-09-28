import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CONCIERGE } from "./data-DhdUlfnB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-BmJeMTMK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SmartLink({ href, className, children, onClick }) {
	if (href.startsWith("/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: href,
		className,
		onClick,
		children
	});
	const ext = href.startsWith("http");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className,
		onClick,
		...ext ? {
			target: "_blank",
			rel: "noreferrer"
		} : {},
		children
	});
}
function More({ href, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SmartLink, {
		href,
		className: "more",
		children: [
			children,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: "→"
			})
		]
	});
}
function Ph({ src, alt, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
		className: `ph${className ? ` ${className}` : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt,
			loading: "lazy"
		})
	});
}
function PageHero({ title, kicker, children, image, alt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `phero${image ? "" : " phero--text"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "phero-text reveal",
			children: [
				kicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "h-display",
					children: title
				}),
				children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "phero-body",
					children
				})
			]
		}), image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "phero-img",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: alt ?? "",
				fetchPriority: "high"
			})
		})]
	});
}
function Accordion({ items }) {
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "acc",
		children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `acc-item${open === i ? " open" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "acc-q",
				"aria-expanded": open === i,
				onClick: () => setOpen(open === i ? null : i),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "acc-icon",
					"aria-hidden": "true"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "acc-a",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: it.a })
			})]
		}, it.q))
	});
}
function Concierge({ title = "Embrowerment® Concierge", quote, quoteTitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "concierge",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "reveal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "h-display",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "concierge-lines",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `tel:${CONCIERGE.tel}`,
						children: CONCIERGE.phone
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${CONCIERGE.email}`,
						children: CONCIERGE.email
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "concierge-note",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Concierge availability" }),
						": ",
						CONCIERGE.hours,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "concierge-note",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Messages received outside these hours will be responded to promptly during concierge hours." })
				})
			]
		}), quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "reveal concierge-quote",
			children: [quoteTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "eyebrow",
				children: quoteTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"“",
				quote.text,
				"”"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("cite", { children: ["— ", quote.by] })] })]
		})]
	});
}
//#endregion
export { Ph as a, PageHero as i, Concierge as n, SmartLink as o, More as r, Accordion as t };
