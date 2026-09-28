import { r as __toESM } from "../_runtime.mjs";
import { r as api } from "./api-CjIkjKHh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useStore } from "./store-DwHIc3eu.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AuthShell } from "./auth-ui-DvMDsNA6.mjs";
import { t as Route } from "./reset-password-B9SM6Hvl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-iE0JTkQ6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reset() {
	const { token, email } = Route.useSearch();
	const nav = useNavigate();
	const { refreshUser } = useStore();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setErr("");
		if (password !== confirm) {
			setErr("Passwords don't match");
			return;
		}
		setBusy(true);
		try {
			await api("/auth/reset", { body: {
				token,
				email,
				password
			} });
			await refreshUser();
			nav({ to: "/account" });
		} catch (x) {
			setErr(x.message);
			setBusy(false);
		}
	};
	if (!token || !email) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Reset password",
		sub: "This reset link is incomplete. Please request a new one."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Choose a new password",
		sub: email,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "form",
			onSubmit: submit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					autoComplete: "new-password",
					minLength: 8,
					required: true,
					value: password,
					onChange: (e) => setPassword(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Confirm password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					autoComplete: "new-password",
					minLength: 8,
					required: true,
					value: confirm,
					onChange: (e) => setConfirm(e.target.value)
				})] }),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "form-error",
					children: err
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn-solid",
					disabled: busy,
					children: busy ? "Saving…" : "Save password"
				})
			]
		})
	});
}
//#endregion
export { Reset as component };
