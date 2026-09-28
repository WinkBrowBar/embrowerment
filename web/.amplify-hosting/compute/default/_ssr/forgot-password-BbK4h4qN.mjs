import { r as __toESM } from "../_runtime.mjs";
import { r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AuthShell } from "./auth-ui-DvMDsNA6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-BbK4h4qN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Forgot() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setErr("");
		setBusy(true);
		try {
			setMsg((await api("/auth/forgot", { body: { email } })).message);
		} catch (x) {
			setErr(x.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Reset password",
		sub: "Enter your email and we'll send you a link to reset your password.",
		foot: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			search: { next: void 0 },
			children: "Back to log in"
		}),
		children: msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "notice",
			children: msg
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "form-error",
					children: err
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn-solid",
					disabled: busy,
					children: busy ? "Sending…" : "Send reset link"
				})
			]
		})
	});
}
//#endregion
export { Forgot as component };
