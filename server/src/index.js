import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { connectDb } from "./lib/db.js";
import { loadUser } from "./middleware/auth.js";
import { HttpError } from "./lib/http.js";
import webhook from "./routes/webhook.js";
import auth from "./routes/auth.js";
import catalog from "./routes/catalog.js";
import cart from "./routes/cart.js";
import checkout from "./routes/checkout.js";
import admin from "./routes/admin.js";
import { getSettings } from "./models/Setting.js";
import foundation from "./routes/foundation.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  // CORS: store/admin origins get credentialed access; the Foundation site may call /api/foundation/* only.
  app.use(cors((req, cb) => {
    const origin = req.headers.origin;
    if (req.path.startsWith("/api/foundation")) {
      getSettings().then(s => {
        const f = s.foundation || {};
        const list = [f.siteUrl, ...(f.allowedOrigins || []), ...config.corsOrigins].filter(Boolean).map(u => u.replace(/\/$/, ""));
        cb(null, { origin: !origin || list.length === 0 || list.includes(origin), credentials: false });
      }).catch(() => cb(null, { origin: false }));
    } else cb(null, { origin: config.corsOrigins, credentials: true });
  }));
  if (!config.isProd) app.use(morgan("dev"));

  app.use("/api/webhooks", webhook);            // raw body — before json parser
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use("/uploads", express.static("uploads", { maxAge: "30d" }));
  app.use(loadUser);

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.get("/api/store", async (_req, res) => { const s = await getSettings(); res.json({ name: s.store.name, currency: s.store.currency, shippingFlat: s.store.shippingFlat, freeShippingOver: s.store.freeShippingOver }); });
  app.use("/api/auth", auth);
  app.use("/api", catalog);
  app.use("/api", cart);
  app.use("/api", checkout);
  app.use("/api/foundation", foundation);
  app.use("/api/admin", admin);

  app.use("/api", (_req, _res, next) => next(new HttpError(404, "Not found")));
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const stripe = typeof err.type === "string" && err.type.startsWith("Stripe");
    const status = err instanceof HttpError ? err.status : err.name === "MulterError" ? 400 : stripe ? (err.type === "StripeInvalidRequestError" ? 400 : 502) : 500;
    if (status >= 500) console.error(err);
    const message = stripe ? `Payment provider error: ${err.message}` : status >= 500 && config.isProd ? "Something went wrong" : err.message;
    res.status(status).json({ error: message, ...(err.details ? { details: err.details } : {}) });
  });
  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await connectDb();
  createApp().listen(config.port, () => console.log(`API on ${config.apiUrl}`));
}
