import { i as money } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as IMG, r as LINKS } from "./data-DhdUlfnB.mjs";
import { a as Ph, o as SmartLink, r as More } from "./ui-BmJeMTMK.mjs";
import { t as Route } from "./routes-CVNBYQ9K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D2vX9Fjp.js
var import_jsx_runtime = require_jsx_runtime();
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "hero",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hero-text reveal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "h-display",
					children: "Confidence begins in the eye zone"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-sub",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Embrowerment®" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A method for brows - a mindset for life" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(More, {
					href: "/method",
					children: "Learn more"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hero-img",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: IMG.hero,
				alt: "Two people standing back to back against a sunlit wall",
				fetchPriority: "high"
			})
		})]
	});
}
function Definition() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "define",
		id: "about-embrowerment",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "define-head reveal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "what is Embrowerment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "h-display",
				children: "Definition [EM.BROW.ER.MENT]"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "define-card reveal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "define-lines",
				children: "BROWS ARE NOT TRENDS. THEY ARE ARCHITECTURE, BALANCE AND SELF- TRUST. YOU WERE NEVER MEANT TO BECOME SOMEONE ELSE. ONLY MORE OF YOURSELF. ROOTED IN PROGRESS, NOT PERFECTION. WELCOME TO EMBROWERMENT. A METHOD FOR BROWS AND A MINDSET FOR LIFE."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "phon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "/i m-b r o u e r-m e n t/" })
			})]
		})]
	});
}
function Tile({ p, feature = false }) {
	const { add } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `ctile${feature ? " feature" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop/$slug",
				params: { slug: p.slug },
				className: "ctile-img",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
					src: p.images[0],
					alt: p.name,
					loading: "lazy"
				}), p.comingSoon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tag",
					children: "Coming soon"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ctile-meta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop/$slug",
					params: { slug: p.slug },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: p.name })
				}), (feature || p.tagline) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p.tagline })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(p.price) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ctile-cta",
				children: p.comingSoon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop/$slug",
					params: { slug: p.slug },
					className: "btn-mono",
					children: "Coming soon"
				}) : p.variants.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop/$slug",
					params: { slug: p.slug },
					className: "btn-mono",
					children: ["Choose ", p.variantLabel.toLowerCase() || "option"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: feature ? "btn-solid" : "btn-mono",
					disabled: !p.inStock,
					onClick: () => add({
						kind: "product",
						ref: p.id,
						qty: 1
					}),
					children: p.inStock ? feature ? "Add to bag" : "Add" : "Sold out"
				})
			})
		]
	});
}
/** Editorial product collage for the home page: lifestyle · featured product · product grid. */
function ProductCollage({ products }) {
	const feature = products.find((p) => p.featured && !p.variants.length) || products[0];
	if (!feature) return null;
	const rest = products.filter((p) => p.id !== feature.id);
	const top = rest.slice(0, 4), bottom = rest.slice(4, 7);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "collage",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "clife tall",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: IMG.products1,
					alt: "Woman with a glowing natural makeup look",
					loading: "lazy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "The Collection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Essentials for the eye zone." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "more",
						children: ["Shop all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						})]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
				p: feature,
				feature: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cgrid",
				children: top.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { p }, p.id))
			}),
			bottom.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cstrip",
				children: [bottom.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { p }, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "clife wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: IMG.products3,
						alt: "Portrait in a coffee shop",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "Brows · Skin · Tools"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Made to extend the Method beyond the chair." })] })]
				})]
			})
		]
	});
}
function Method() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "method",
		id: "method",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
			src: IMG.method,
			alt: "Model framing her face with raised arms in soft sunlight"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "method-body reveal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "h-display",
				children: "The Method."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "feat-copy",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A structured, science-led approach to the eye zone. Every brow is mapped to bone structure, growth pattern and facial balance before a single hair is touched, then managed over time so the shape stays yours." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(More, {
					href: LINKS.method,
					children: "Learn more"
				})]
			})]
		})]
	});
}
function PermanentMakeup() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat",
		id: "permanent-makeup",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "feat-head reveal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "h-display",
				children: "Permanent makeup."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "feat-copy",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Semi-permanent brow work designed with the same precision as the method: measured, conservative, and built to age well with your face rather than follow a trend." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(More, {
					href: LINKS.pmu,
					children: "Learn more"
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
	});
}
function Products({ products = [] }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat",
		id: "products",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "feat-head reveal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "h-display",
					children: "Products."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "feat-copy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Professional-grade tools and formulas developed around the eye zone — sculpting pencils, precision instruments, serums and care, made to extend the method beyond the chair." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(More, {
						href: "/shop",
						children: "Shop all"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "collection",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: IMG.collection,
					alt: "Embrowerment® product collection",
					loading: "lazy"
				})
			}),
			products.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCollage, { products }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shop-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: IMG.products1,
						alt: "Woman with a glowing natural makeup look against a blue sky"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
								src: IMG.kit,
								alt: "Embrowerment Pro Precision kit: tweezers, scissors, brow tool and spoolie"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-meta",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "The Essential Embrowerment® Kit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "For professionals who desire precision Artistry" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "card-price",
									children: "$80"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
								href: "/shop/pro-essentials-kit",
								className: "btn-mono",
								children: "Buy"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: IMG.products3,
						alt: "Man in a coffee shop photographed through glass"
					})
				]
			})
		]
	});
}
function Academy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat",
		id: "academy",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "feat-head reveal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "h-display",
				children: "Academy."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "feat-copy",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Education for beauty professionals who want the science behind the shape. Courses translate anatomy and growth behavior into technique you can use from your next client onward." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(More, {
					href: "/academy",
					children: "See Courses"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "academy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
					className: "tall",
					src: IMG.academy,
					alt: "Close-up of an eye and a defined brow"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
					className: "wide",
					src: IMG.studio[0],
					alt: "Hands working with material samples on a wooden table"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "academy-pair",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: IMG.studio[1],
						alt: "Globe lamp and swatches on a dark console"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
						src: IMG.studio[2],
						alt: "Notebook and swatches on a burl wood desk"
					})]
				})
			]
		})]
	});
}
function AboutUmbreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "about",
		id: "about-umbreen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "about-copy reveal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "h-display",
					children: "About Umbreen."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Embrowerment® was created by Umbreen Sheikh, a biomedical scientist, entrepreneur, and the creator of The Embrowerment Method®. Guided by the belief that confidence begins in the eye zone, she combines science, artistry, and education to help people look and feel more like themselves. Through Embrowerment, her mission is to transform not only brows, but confidence itself." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(More, {
					href: LINKS.umbreen,
					children: "Meet Umbreen"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "about-imgs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ph, {
				className: "main",
				src: IMG.umbreen,
				alt: "Umbreen Sheikh in a black suit, black and white portrait"
			})
		})]
	});
}
function Index() {
	const products = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Definition, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Method, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PermanentMakeup, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Products, { products }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Academy, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutUmbreen, {})
	] });
}
//#endregion
export { Index as component };
