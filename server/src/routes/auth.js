import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { User } from "../models/User.js";
import { parse, bad, unauthorized } from "../lib/http.js";
import { setAuthCookie, clearAuthCookie, requireUser } from "../middleware/auth.js";
import { emails } from "../lib/mailer.js";
import { randomToken, sha256 } from "../lib/crypto.js";
import { config } from "../config.js";

const r = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { error: "Too many attempts, please try again later" } });
const password = z.string().min(8, "Password must be at least 8 characters").max(128);

r.post("/register", limiter, async (req, res) => {
  const b = parse(z.object({ name: z.string().trim().max(80).default(""), email: z.email().toLowerCase(), password }), req.body);
  if (await User.exists({ email: b.email })) throw bad("An account with this email already exists");
  const user = await User.create({ name: b.name, email: b.email, passwordHash: await bcrypt.hash(b.password, 12) });
  setAuthCookie(res, user); emails.welcome(user);
  res.status(201).json({ user: user.toSafe() });
});

r.post("/login", limiter, async (req, res) => {
  const b = parse(z.object({ email: z.email().toLowerCase(), password: z.string().min(1) }), req.body);
  const user = await User.findOne({ email: b.email }).select("+passwordHash");
  if (!user || !user.active || !(await bcrypt.compare(b.password, user.passwordHash))) throw unauthorized("Incorrect email or password");
  user.lastLoginAt = new Date(); await user.save();
  setAuthCookie(res, user);
  res.json({ user: user.toSafe() });
});

r.post("/logout", (_req, res) => { clearAuthCookie(res); res.json({ ok: true }); });

r.get("/me", (req, res) => res.json({ user: req.user ? req.user.toSafe() : null }));

r.patch("/me", requireUser, async (req, res) => {
  const b = parse(z.object({ name: z.string().trim().max(80) }), req.body);
  req.user.name = b.name; await req.user.save();
  res.json({ user: req.user.toSafe() });
});

r.post("/change-password", requireUser, async (req, res) => {
  const b = parse(z.object({ current: z.string(), password }), req.body);
  const u = await User.findById(req.user._id).select("+passwordHash");
  if (!(await bcrypt.compare(b.current, u.passwordHash))) throw bad("Current password is incorrect");
  u.passwordHash = await bcrypt.hash(b.password, 12); u.tokenVersion += 1; await u.save();
  setAuthCookie(res, u);
  res.json({ ok: true });
});

r.post("/forgot", limiter, async (req, res) => {
  const b = parse(z.object({ email: z.email().toLowerCase() }), req.body);
  const user = await User.findOne({ email: b.email });
  if (user && user.active) {
    const token = randomToken();
    user.resetTokenHash = sha256(token); user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); await user.save();
    await emails.reset(user, `${config.clientUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`);
  }
  res.json({ ok: true, message: "If an account exists for that email, a reset link has been sent." });
});

r.post("/reset", limiter, async (req, res) => {
  const b = parse(z.object({ email: z.email().toLowerCase(), token: z.string().length(64), password }), req.body);
  const user = await User.findOne({ email: b.email }).select("+resetTokenHash +resetTokenExp");
  if (!user || user.resetTokenHash !== sha256(b.token) || !user.resetTokenExp || user.resetTokenExp < new Date()) throw bad("This reset link is invalid or has expired");
  user.passwordHash = await bcrypt.hash(b.password, 12);
  user.resetTokenHash = undefined; user.resetTokenExp = undefined; user.tokenVersion += 1;
  await user.save();
  setAuthCookie(res, user);
  res.json({ user: user.toSafe() });
});

export default r;
