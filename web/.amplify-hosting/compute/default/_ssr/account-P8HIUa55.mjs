import { r as __toESM } from "../_runtime.mjs";
import { i as money, r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { t as SafeImg } from "./SafeImg-7ZDpTPI9.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as statusLabel, t as Route } from "./account-CNjzSdQt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-P8HIUa55.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useRequireUser() {
	const { user, ready } = useStore();
	const nav = useNavigate();
	(0, import_react.useEffect)(() => {
		if (ready && !user) nav({
			to: "/login",
			search: { next: window.location.pathname + window.location.search }
		});
	}, [
		ready,
		user,
		nav
	]);
	return ready && user ? user : null;
}
function Account() {
	const user = useRequireUser();
	const { logout, setUser } = useStore();
	const nav = useNavigate();
	const tab = Route.useSearch().tab || "orders";
	const [orders, setOrders] = (0, import_react.useState)(null);
	const [courses, setCourses] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [pw, setPw] = (0, import_react.useState)({
		current: "",
		password: ""
	});
	const [msg, setMsg] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		setName(user.name);
		api("/orders").then((d) => setOrders(d.orders));
		api("/my/courses").then((d) => setCourses(d.courses));
	}, [user]);
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "feat",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted",
			children: "Loading…"
		})
	});
	const saveName = async (e) => {
		e.preventDefault();
		setMsg("");
		setErr("");
		try {
			setUser((await api("/auth/me", {
				method: "PATCH",
				body: { name }
			})).user);
			setMsg("Profile saved");
		} catch (x) {
			setErr(x.message);
		}
	};
	const savePw = async (e) => {
		e.preventDefault();
		setMsg("");
		setErr("");
		try {
			await api("/auth/change-password", { body: pw });
			setPw({
				current: "",
				password: ""
			});
			setMsg("Password updated");
		} catch (x) {
			setErr(x.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "feat account",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "account-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "h-display",
						children: [
							"Hello",
							user.name ? `, ${user.name.split(" ")[0]}` : "",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "muted-t",
						children: user.email
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wishlist",
						className: "btn-mono",
						children: "Wishlist"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-mono",
						onClick: async () => {
							await logout();
							nav({ to: "/" });
						},
						children: "Log out"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "filters",
				children: [
					"orders",
					"courses",
					"profile"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account",
					search: { tab: t },
					className: tab === t ? "on" : "",
					children: t === "orders" ? "Orders" : t === "courses" ? "My courses" : "Profile"
				}, t))
			}),
			tab === "orders" && (orders === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted",
				children: "Loading…"
			}) : orders.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "otable",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Items" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "num",
						children: "Total"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account/orders/$id",
						params: { id: o.id },
						children: o.number
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(o.createdAt).toLocaleDateString() }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `status s-${o.status}`,
						children: statusLabel(o.status)
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: o.items.reduce((n, i) => n + i.qty, 0) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "num",
						children: money(o.total)
					})
				] }, o.id)) })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "lede",
				children: ["No orders yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "link",
					children: "Start shopping"
				})]
			})),
			tab === "courses" && (courses === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted",
				children: "Loading…"
			}) : courses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "courses",
				children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "course",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pcard-img",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/learn/$slug",
								params: { slug: c.slug },
								search: { lesson: void 0 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
									src: c.image,
									alt: c.title
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-meta",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: c.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "muted-t",
								children: [
									c.lessonCount,
									" lesson",
									c.lessonCount === 1 ? "" : "s"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/learn/$slug",
							params: { slug: c.slug },
							search: { lesson: void 0 },
							className: "btn-solid",
							children: "Start course"
						})
					]
				}, c.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "lede",
				children: ["You haven't enrolled in any courses yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/academy",
					className: "link",
					children: "Browse the Academy"
				})]
			})),
			tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "profile-grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "form",
						onSubmit: saveName,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Profile" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: user.email,
								disabled: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-solid",
								children: "Save"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "form",
						onSubmit: savePw,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Change password" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Current password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								autoComplete: "current-password",
								required: true,
								value: pw.current,
								onChange: (e) => setPw({
									...pw,
									current: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								autoComplete: "new-password",
								minLength: 8,
								required: true,
								value: pw.password,
								onChange: (e) => setPw({
									...pw,
									password: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-solid",
								children: "Update password"
							})
						]
					}),
					(msg || err) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: err ? "form-error" : "notice",
						children: err || msg
					})
				]
			})
		]
	});
}
//#endregion
export { Account as component, useRequireUser };
