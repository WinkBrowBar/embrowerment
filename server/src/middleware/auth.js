import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { User } from "../models/User.js";
import { unauthorized, forbidden } from "../lib/http.js";

export const COOKIE = "emb_token";
const MAX_AGE = 1000 * 60 * 60 * 24 * 30;

export function setAuthCookie(res, user) {
  const token = jwt.sign({ sub: String(user._id), v: user.tokenVersion }, config.jwtSecret, { expiresIn: "30d" });
  res.cookie(COOKIE, token, { httpOnly: true, secure: config.cookieSecure, sameSite: config.cookieSecure ? "none" : "lax", maxAge: MAX_AGE, path: "/" });
  return token;
}
export const clearAuthCookie = (res) => res.clearCookie(COOKIE, { path: "/", sameSite: config.cookieSecure ? "none" : "lax", secure: config.cookieSecure });

/** Loads req.user if a valid token is present (cookie or Bearer). Never rejects. */
export async function loadUser(req, _res, next) {
  const raw = req.cookies?.[COOKIE] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null);
  if (raw) {
    try {
      const p = jwt.verify(raw, config.jwtSecret);
      const u = await User.findById(p.sub);
      if (u && u.active && u.tokenVersion === p.v) req.user = u;
    } catch { /* invalid/expired token → anonymous */ }
  }
  next();
}

export const requireUser = (req, _res, next) => next(req.user ? undefined : unauthorized());
export const requireAdmin = (req, _res, next) => next(!req.user ? unauthorized() : req.user.role !== "admin" ? forbidden("Admins only") : undefined);
