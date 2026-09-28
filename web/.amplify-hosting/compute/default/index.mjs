globalThis.__nitro_main__ = import.meta.url;
import { i as toEventHandler, n as defineHandler, o as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { i as toNodeHandler, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { Server } from "node:http";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"3aee-J0GT3Urs/eNU6nDp7yNXobWb8NE\"",
		"mtime": "2026-09-28T16:58:00.332Z",
		"size": 15086,
		"path": "../../static/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-28T16:58:00.332Z",
		"size": 160,
		"path": "../../static/robots.txt"
	},
	"/images/academy.webp": {
		"type": "image/webp",
		"etag": "\"56f4a-U9cDn3U1sCTH92dc9XFPVOrWi0g\"",
		"mtime": "2026-09-28T16:58:00.326Z",
		"size": 356170,
		"path": "../../static/images/academy.webp"
	},
	"/images/collection.webp": {
		"type": "image/webp",
		"etag": "\"7124-1fbvJyPMtnO+Ovy2v1M99jbCgIE\"",
		"mtime": "2026-09-28T16:58:00.324Z",
		"size": 28964,
		"path": "../../static/images/collection.webp"
	},
	"/images/hero.webp": {
		"type": "image/webp",
		"etag": "\"15bcc-/UgDOGUsnxYncxisfXixcGeJNIQ\"",
		"mtime": "2026-09-28T16:58:00.325Z",
		"size": 89036,
		"path": "../../static/images/hero.webp"
	},
	"/images/kit.webp": {
		"type": "image/webp",
		"etag": "\"b626-boQjaHyuXPOFtcIkXCTNuAttwQ8\"",
		"mtime": "2026-09-28T16:58:00.324Z",
		"size": 46630,
		"path": "../../static/images/kit.webp"
	},
	"/images/logo-white.png": {
		"type": "image/png",
		"etag": "\"18f2-OzurTUiBwVatlTaIIYUcIeqL9B4\"",
		"mtime": "2026-09-28T16:58:00.325Z",
		"size": 6386,
		"path": "../../static/images/logo-white.png"
	},
	"/images/method.webp": {
		"type": "image/webp",
		"etag": "\"8c62-xq3o/jrkytAnGP0L3Cvs7FEQ0lE\"",
		"mtime": "2026-09-28T16:58:00.326Z",
		"size": 35938,
		"path": "../../static/images/method.webp"
	},
	"/images/pmu-3.webp": {
		"type": "image/webp",
		"etag": "\"222dc-P7/rmMdJ4JF/URXE6mHze/PcMTg\"",
		"mtime": "2026-09-28T16:58:00.328Z",
		"size": 139996,
		"path": "../../static/images/pmu-3.webp"
	},
	"/images/pmu-2.webp": {
		"type": "image/webp",
		"etag": "\"4568-u8HDhIMjNrBAYVPhM5y9lO4AnhI\"",
		"mtime": "2026-09-28T16:58:00.327Z",
		"size": 17768,
		"path": "../../static/images/pmu-2.webp"
	},
	"/images/products-1.webp": {
		"type": "image/webp",
		"etag": "\"20bf8-ODkiMyi0fxR/QnB5bcJ/TYVS6Y8\"",
		"mtime": "2026-09-28T16:58:00.328Z",
		"size": 134136,
		"path": "../../static/images/products-1.webp"
	},
	"/images/products-2.webp": {
		"type": "image/webp",
		"etag": "\"1e704-KgeRCnh+h8znin6FRiML91/KQos\"",
		"mtime": "2026-09-28T16:58:00.329Z",
		"size": 124676,
		"path": "../../static/images/products-2.webp"
	},
	"/images/products-3.webp": {
		"type": "image/webp",
		"etag": "\"1e6b6-kt2INUfh1zOOOiJ70zy/wp05NCY\"",
		"mtime": "2026-09-28T16:58:00.330Z",
		"size": 124598,
		"path": "../../static/images/products-3.webp"
	},
	"/images/studio-1.webp": {
		"type": "image/webp",
		"etag": "\"1b4a4-J+E3Lcz8xMvuteQ3uTMmYz03wUE\"",
		"mtime": "2026-09-28T16:58:00.332Z",
		"size": 111780,
		"path": "../../static/images/studio-1.webp"
	},
	"/images/studio-2.webp": {
		"type": "image/webp",
		"etag": "\"ca6a-AZSAl+ABvSkb1KwrmiQLg37SM/M\"",
		"mtime": "2026-09-28T16:58:00.331Z",
		"size": 51818,
		"path": "../../static/images/studio-2.webp"
	},
	"/images/umbreen.webp": {
		"type": "image/webp",
		"etag": "\"47b4-SI1hq/3Auk8FI0/1lus441lwGag\"",
		"mtime": "2026-09-28T16:58:00.332Z",
		"size": 18356,
		"path": "../../static/images/umbreen.webp"
	},
	"/assets/academy.index-BaGeZEZ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e3-NfsVTIl4+mbe398N0NwUViWNIAQ\"",
		"mtime": "2026-09-28T16:57:59.453Z",
		"size": 1507,
		"path": "../../static/assets/academy.index-BaGeZEZ8.js"
	},
	"/assets/academy.index-DBQBc_nZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d9-lZEB1SCLTdOMDY9gFRpkbxQUNLM\"",
		"mtime": "2026-09-28T16:57:59.453Z",
		"size": 1753,
		"path": "../../static/assets/academy.index-DBQBc_nZ.js"
	},
	"/assets/academy._slug-u6X4_AjZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c7-GKkQ3BhfspntCRDKTqJ4lZlXLUg\"",
		"mtime": "2026-09-28T16:57:59.453Z",
		"size": 2247,
		"path": "../../static/assets/academy._slug-u6X4_AjZ.js"
	},
	"/assets/auth-ui-kTmQLBIV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bd-QPKMmIZsEWNu6fyX13myc1DxzC8\"",
		"mtime": "2026-09-28T16:57:59.454Z",
		"size": 445,
		"path": "../../static/assets/auth-ui-kTmQLBIV.js"
	},
	"/assets/account-BAaLZ9Rp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135e-LkhVb313J+r/MJKUA+kXCP7jWME\"",
		"mtime": "2026-09-28T16:57:59.453Z",
		"size": 4958,
		"path": "../../static/assets/account-BAaLZ9Rp.js"
	},
	"/assets/api-B8HPxRGN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"373-zikPi47IvwgCtj7rYSrkEfG53Sw\"",
		"mtime": "2026-09-28T16:57:59.454Z",
		"size": 883,
		"path": "../../static/assets/api-B8HPxRGN.js"
	},
	"/assets/account_.orders._id-BmJZqpWL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b02-i9dcgqS6zww0HYj3VqW8XKieRqs\"",
		"mtime": "2026-09-28T16:57:59.454Z",
		"size": 2818,
		"path": "../../static/assets/account_.orders._id-BmJZqpWL.js"
	},
	"/images/studio-3.webp": {
		"type": "image/webp",
		"etag": "\"13f64-EXLm8DKpwgR6XpVMlFNJdqZfLh8\"",
		"mtime": "2026-09-28T16:58:00.332Z",
		"size": 81764,
		"path": "../../static/images/studio-3.webp"
	},
	"/images/pmu-1.webp": {
		"type": "image/webp",
		"etag": "\"a88c0-6JDQI8BpF0AeaCWp3wjYg0VEx7o\"",
		"mtime": "2026-09-28T16:58:00.330Z",
		"size": 690368,
		"path": "../../static/images/pmu-1.webp"
	},
	"/assets/cart-CJ7bRKnt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e3-9eBpNk0Q2fhmlwdvu0Av9gYcs5M\"",
		"mtime": "2026-09-28T16:57:59.454Z",
		"size": 1507,
		"path": "../../static/assets/cart-CJ7bRKnt.js"
	},
	"/assets/checkout.success-CTu9tpys.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63e-WDdBXwIqpEHUHRI1ineZwPXZDj0\"",
		"mtime": "2026-09-28T16:57:59.454Z",
		"size": 1598,
		"path": "../../static/assets/checkout.success-CTu9tpys.js"
	},
	"/assets/forgot-password-B3AGaVPR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"414-J9Rqwzb2/Th5kDisE8k20KWSkBU\"",
		"mtime": "2026-09-28T16:57:59.454Z",
		"size": 1044,
		"path": "../../static/assets/forgot-password-B3AGaVPR.js"
	},
	"/assets/learn._slug-eX7F6O5y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c39-yYGsUosz4Uh+Azbe9FPRaOnqK1I\"",
		"mtime": "2026-09-28T16:57:59.455Z",
		"size": 3129,
		"path": "../../static/assets/learn._slug-eX7F6O5y.js"
	},
	"/assets/login-CARdzUOB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"540-U1evXRewXsP0j4lLAz5g/SKoGrs\"",
		"mtime": "2026-09-28T16:57:59.455Z",
		"size": 1344,
		"path": "../../static/assets/login-CARdzUOB.js"
	},
	"/assets/link-C5U38H4x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c13-BKRiXNjzhsBWHBxO+B36NFClZ6s\"",
		"mtime": "2026-09-28T16:57:59.455Z",
		"size": 35859,
		"path": "../../static/assets/link-C5U38H4x.js"
	},
	"/assets/method-CXAJz6Yx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b7e-2HKaVPh1CQQI2eZ8IcfWCPssGjY\"",
		"mtime": "2026-09-28T16:57:59.455Z",
		"size": 2942,
		"path": "../../static/assets/method-CXAJz6Yx.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-09-28T16:57:59.455Z",
		"size": 118,
		"path": "../../static/assets/not-found-i5RsCZif.js"
	},
	"/assets/permanent-makeup-B2Sfmp-Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1375-S434rKdpJE1zAIRIIu5s78aPJ8I\"",
		"mtime": "2026-09-28T16:57:59.455Z",
		"size": 4981,
		"path": "../../static/assets/permanent-makeup-B2Sfmp-Y.js"
	},
	"/assets/pmu-policies-C9Ht3_J-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128e-6mC9/VRhoJfbg5NUz28c/XGC0NQ\"",
		"mtime": "2026-09-28T16:57:59.456Z",
		"size": 4750,
		"path": "../../static/assets/pmu-policies-C9Ht3_J-.js"
	},
	"/assets/reset-password-KTwO7DP_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"561-3rbpK29O6p6PfB2Gc24n61w3htM\"",
		"mtime": "2026-09-28T16:57:59.456Z",
		"size": 1377,
		"path": "../../static/assets/reset-password-KTwO7DP_.js"
	},
	"/assets/returns-BxX3Oz9Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b1-bD+CwMpMVfMD0emYVeiFZu80I9E\"",
		"mtime": "2026-09-28T16:57:59.456Z",
		"size": 2225,
		"path": "../../static/assets/returns-BxX3Oz9Z.js"
	},
	"/assets/routes-DivrcA8o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"225b-j8kTDYryzWBw/urLDJOvH96oUqU\"",
		"mtime": "2026-09-28T16:57:59.456Z",
		"size": 8795,
		"path": "../../static/assets/routes-DivrcA8o.js"
	},
	"/assets/register-4nlrPriM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d9-GGKoJFFQzK64LfVLio/1X8JVADs\"",
		"mtime": "2026-09-28T16:57:59.456Z",
		"size": 1497,
		"path": "../../static/assets/register-4nlrPriM.js"
	},
	"/assets/shop._slug-kxcwlJHC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dde-36n+0D+H4phYq7kOt9VgQ3IfQBo\"",
		"mtime": "2026-09-28T16:57:59.456Z",
		"size": 3550,
		"path": "../../static/assets/shop._slug-kxcwlJHC.js"
	},
	"/assets/shop.index-BLIHvg9R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6fc-Ujrz9mVQs8dgZUWs2R4+wMdrauw\"",
		"mtime": "2026-09-28T16:57:59.457Z",
		"size": 1788,
		"path": "../../static/assets/shop.index-BLIHvg9R.js"
	},
	"/assets/shop.index-Et-zPKbh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95e-cTwomcAIIaaqEG8NSV9R62FNY5M\"",
		"mtime": "2026-09-28T16:57:59.457Z",
		"size": 2398,
		"path": "../../static/assets/shop.index-Et-zPKbh.js"
	},
	"/assets/store-BaZ5RnOF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cd9-O7Cm265feMiYtqqGMgCfQvkpL0Q\"",
		"mtime": "2026-09-28T16:57:59.457Z",
		"size": 3289,
		"path": "../../static/assets/store-BaZ5RnOF.js"
	},
	"/assets/ui-CuckBbet.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a42-+j+F8TugszuaXmyx91SipUIOrQo\"",
		"mtime": "2026-09-28T16:57:59.457Z",
		"size": 2626,
		"path": "../../static/assets/ui-CuckBbet.js"
	},
	"/assets/wishlist-DBV2F4e2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"441-nMeJjC94Qpyc5N9AuPDqS9z6leE\"",
		"mtime": "2026-09-28T16:57:59.457Z",
		"size": 1089,
		"path": "../../static/assets/wishlist-DBV2F4e2.js"
	},
	"/assets/styles-CkrZRFCm.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1b009-E1G8iknH6zdMjRPms7kJbSSPmzc\"",
		"mtime": "2026-09-28T16:57:59.458Z",
		"size": 110601,
		"path": "../../static/assets/styles-CkrZRFCm.css"
	},
	"/assets/index-DLZIHehe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"59703-keJ00bwfKNvotod9WDlzn4OJxdA\"",
		"mtime": "2026-09-28T16:57:59.453Z",
		"size": 366339,
		"path": "../../static/assets/index-DLZIHehe.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_LCdgK5 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_LCdgK5
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/aws-amplify/runtime/aws-amplify.mjs
var nitroApp = useNitroApp();
new Server(toNodeHandler(nitroApp.fetch)).listen(3e3, (err) => {
	if (err) console.error(err);
	else console.log(`Listening on http://localhost:3000 (AWS Amplify Hosting)`);
});
//#endregion
export {};
