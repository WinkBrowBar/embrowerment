import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as safeNext, t as AuthShell } from "./auth-ui-DvMDsNA6.mjs";
import { t as Route } from "./login-Czzpn5zf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DOJ7awYt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { login, user, ready } = useStore();
	const { next } = Route.useSearch();
	const nav = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (ready && user) nav({ to: safeNext(next) });
	}, [
		ready,
		user,
		next,
		nav
	]);
	const submit = async (e) => {
		e.preventDefault();
		setErr("");
		setBusy(true);
		try {
			await login(email, password);
		} catch (x) {
			setErr(x.message);
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Log in",
		foot: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["New here? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/register",
			search: { next },
			children: "Create an account"
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "form",
			onSubmit: submit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "email",
					autoComplete: "email",
					required: true,
					value: email,
					onChange: (e) => setEmail(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					autoComplete: "current-password",
					required: true,
					value: password,
					onChange: (e) => setPassword(e.target.value)
				})] }),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "form-error",
					role: "alert",
					children: err
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn-solid",
					disabled: busy,
					children: busy ? "Logging in…" : "Log in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/forgot-password",
					className: "link small",
					children: "Forgot your password?"
				})
			]
		})
	});
}
//#endregion
export { Login as component };
