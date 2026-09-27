import crypto from "node:crypto";
import { config } from "../config.js";

const key = crypto.createHash("sha256").update(config.encryptionKey).digest();

/** AES-256-GCM. Output: iv.tag.ciphertext (base64url). */
export function encrypt(plain) {
  if (!plain) return "";
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([c.update(String(plain), "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map(b => b.toString("base64url")).join(".");
}

export function decrypt(payload) {
  if (!payload) return "";
  const [iv, tag, enc] = payload.split(".").map(s => Buffer.from(s, "base64url"));
  const d = crypto.createDecipheriv("aes-256-gcm", key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}

export const mask = (v) => (v ? `${v.slice(0, 7)}••••${v.slice(-4)}` : "");
export const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");
export const randomToken = () => crypto.randomBytes(32).toString("hex");
