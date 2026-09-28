import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as IMG, r as LINKS } from "./data-DhdUlfnB.mjs";
import { a as Ph, i as PageHero, n as Concierge, o as SmartLink, t as Accordion } from "./ui-BmJeMTMK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/permanent-makeup-9wjb8V5N.js
var import_jsx_runtime = require_jsx_runtime();
var FOLLOW = [
	"FOLLOW UP",
	"Included for free with any of the initial brow services when booked six (6) weeks after initial appointment",
	"$350"
];
var BROWS = [
	[
		"Nanoblading",
		"Cutting-edge technique. Precision hair-like strokes",
		"$950"
	],
	[
		"Microshading / Combo Brows",
		"Combines hair-like strokes with powder-like shading",
		"$950"
	],
	[
		"Ombre / Powder Brows",
		"Gives the effect of makeup colored in brows",
		"$950"
	],
	[
		"Hybrid Brows",
		"Custom technique mixing any of the other brow services",
		"$1000"
	],
	[
		"Microblading",
		"Hair-like strokes",
		"$900"
	],
	FOLLOW
];
var EYES = [
	[
		"Classic Eyeliner Winged",
		"Replaces the need to wear eyeliner every day",
		"$900"
	],
	[
		"Lash Line Enhancement No Wing",
		"Make your lashes appear fuller and fill in gaps",
		"$900"
	],
	FOLLOW
];
var POST = [[
	"Annual",
	"9-15 months after your follow-up appointment",
	"$600"
], [
	"AFTER 15 MONTHS",
	"Any appointment made after the 15 month time frame is considered a new service.",
	""
]];
function PriceList({ title, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "plist reveal",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: rows.map(([n, d, p]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: n }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d })] }), p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: p })] }, n + d)) })]
	});
}
function PMU() {
	const book = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
		href: LINKS.consult,
		className: "btn-solid",
		children: "Book a Consultation"
	});
	const lookbook = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
		href: LINKS.lookbook,
		className: "btn-mono",
		children: "View the Lookbook"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHero, {
			title: "permanent makeup",
			image: IMG.products1,
			alt: "Woman with a glowing natural makeup look",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row",
				children: [book, lookbook]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Consultations are personally conducted by Umbreen at no- charge and are designed solely to assess candidacy, suitability, and long-term outcomes. If you are booked following consultation and approval, the service is performed by certified and vetted artists who are certified in the Embrowerment® Method." })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "method",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
				src: IMG.method,
				alt: "Model portrait in natural light"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "method-body reveal",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "eyebrow",
						children: "LOVED BY 100'S OF CLIENTS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "h-display",
						children: "NEXT GEN: YOUR BEST BROWS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "feat-copy",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Our Embrowerment® Advanced Semi-Permanent Makeup Method is the next generation in creating perfectly balanced, full & natural looking brows that last years." }) }), book]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "feat",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "feat-head wide reveal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "h-display",
					children: "Pricing"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "plist-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceList, {
					title: "BROWS",
					rows: BROWS
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceList, {
					title: "Eyes",
					rows: EYES
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "feat split dark",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reveal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "h-display",
					children: "FAQ"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, { items: [{
				q: "What is nanoblading",
				a: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The most innovative procedure in the Semi-Permanent Makeup family. Similar to Microblading, Nanoblading utilizes a much smaller needle than Microblading which improves precision to produce even more natural looking hair like stroke results." })
			}, {
				q: "How long does it take",
				a: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"The first session is estimated to last 2.5hrs.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Follow up sessions are 2 hrs."
				] })
			}] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "feat",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "feat-head wide reveal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "h-display",
					children: "PRICING"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "plist-grid",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceList, {
					title: "Post Follow-Up",
					rows: POST
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Concierge, {
			title: "Embrowerment® Concierge",
			quoteTitle: "Contact us",
			quote: {
				text: "My brows were custom mapped to align with my face and bone structure, the brow color was matched to my liking. The results were impeccable and I was on a zoom call later the same day.",
				by: "PMU Client"
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "feat",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "feat-head reveal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "h-display",
					children: "We have years of experience in all skin tones and types"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "feat-copy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "See healed results across skin tones, types and techniques." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SmartLink, {
						href: LINKS.lookbook,
						className: "more",
						children: ["View the Lookbook ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: IMG.pmu[0],
						alt: "Black and white silhouette behind sheer mesh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: IMG.pmu[1],
						alt: "Black and white motion-blurred portrait"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: IMG.pmu[2],
						alt: "Black and white side profile portrait of a woman"
					})
				]
			})]
		})
	] });
}
//#endregion
export { PMU as component };
