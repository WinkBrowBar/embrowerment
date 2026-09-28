//#region node_modules/.nitro/vite/services/ssr/assets/api-CjIkjKHh.js
var API = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://localhost:4001"
}["VITE_API_URL"] || "http://localhost:4000";
var ApiError = class extends Error {
	status;
	details;
	constructor(status, message, details) {
		super(message);
		this.status = status;
		this.details = details;
	}
};
async function api(path, opts = {}) {
	const init = {
		method: opts.method || (opts.body ? "POST" : "GET"),
		credentials: "include"
	};
	if (opts.body) {
		init.headers = { "Content-Type": "application/json" };
		init.body = JSON.stringify(opts.body);
	}
	const res = await fetch(`${API}/api${path}`, init);
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new ApiError(res.status, data.details?.[0]?.message || data.error || "Something went wrong", data.details);
	return data;
}
var money = (n) => `$${Number(n || 0).toFixed(2)}`;
//#endregion
export { money as i, ApiError as n, api as r, API as t };
