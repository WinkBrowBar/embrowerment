import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as IMG } from "./data-DhdUlfnB.mjs";
import { a as Ph, i as PageHero, o as SmartLink } from "./ui-BmJeMTMK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/method-WG4YcSvY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INCLUDED = [
	"Initial Consultation",
	"Brainstorming Session",
	"Collaborative Planning",
	"Customized Deliverables",
	"Multiple Feedback Rounds",
	"Actionable Recommendations",
	"Post-Project Support"
];
var TIERS = [
	{
		level: "Basic Service",
		name: "The Atlas Project",
		img: IMG.studio[0]
	},
	{
		level: "Intermediate Service",
		name: "The Echo Project",
		img: IMG.studio[1]
	},
	{
		level: "Advanced Service",
		name: "The Brightline Project",
		img: IMG.studio[2],
		recommended: true
	}
];
function MethodPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const onSubmit = (e) => {
		e.preventDefault();
		setSent(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			title: "Explore Our Services",
			image: IMG.pmu[2],
			alt: "Black and white side profile portrait",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
				href: "#inquire",
				className: "btn-solid",
				children: "Inquire Now"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "feat",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "feat-head wide reveal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "h-display",
					children: "What We Offer"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tiers",
				children: TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `tier reveal${t.recommended ? " rec" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: t.img,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tier-body",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tier-top",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "eyebrow",
									children: t.level
								}), t.recommended && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge",
									children: "Recommended"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SmartLink, {
								href: "#inquire",
								className: "tier-name",
								children: [
									t.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "→"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Included"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: INCLUDED.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: p }, p)) })
						]
					})]
				}, t.name))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "quote-band reveal",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "“Their attention to detail and commitment to quality truly stood out. We've already recommended them to others.”" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cite", { children: "– Former Customer" })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "feat split",
			id: "inquire",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reveal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "h-display",
					children: "Get In Touch"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lede",
					children: "If you're interested in working with us, complete the form with a few details about your project. We'll review your message and get back to you within 48 hours."
				})]
			}), sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "form-done",
				children: "Thank you!"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "form",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						name: "name",
						autoComplete: "name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						name: "email",
						autoComplete: "email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						name: "message",
						rows: 5
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-solid",
						type: "submit",
						children: "Submit"
					})
				]
			})]
		})
	] });
}
//#endregion
export { MethodPage as component };
