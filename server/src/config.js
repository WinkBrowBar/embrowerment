import "dotenv/config";

const req = (k, fallback) => {
  const v = process.env[k] ?? fallback;
  if (v === undefined || v === "") throw new Error(`Missing env var ${k}`);
  return v;
};
const list = (v) => v.split(",").map(s => s.trim()).filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: req("MONGO_URI"),
  jwtSecret: req("JWT_SECRET"),
  encryptionKey: req("ENCRYPTION_KEY"),
  clientUrl: list(req("CLIENT_URL"))[0],
  corsOrigins: [...list(req("CLIENT_URL")), ...list(process.env.ADMIN_URL || "")],
  apiUrl: req("API_URL", `http://localhost:${process.env.PORT || 4000}`),
  cookieSecure: process.env.COOKIE_SECURE === "true",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  isProd: process.env.NODE_ENV === "production",
};
