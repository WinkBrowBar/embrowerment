import mongoose from "mongoose";
import { encrypt, decrypt, mask } from "../lib/crypto.js";

// Single settings document. Secrets are stored encrypted (AES-256-GCM) and never returned in full.
const settingSchema = new mongoose.Schema({
  _id: { type: String, default: "main" },
  store: {
    name: { type: String, default: "Embrowerment®" },
    currency: { type: String, default: "usd" },
    notifyEmail: { type: String, default: "" },    // receives new-order alerts
    shippingFlat: { type: Number, default: 8 },
    freeShippingOver: { type: Number, default: 100 },
    taxRate: { type: Number, default: 0 },          // percent, e.g. 8.875
    shippingCountries: { type: [String], default: ["US"] },
  },
  stripe: {
    mode: { type: String, enum: ["test", "live"], default: "test" },
    publishableKey: { type: String, default: "" },
    secretKeyEnc: { type: String, default: "" },
    webhookSecretEnc: { type: String, default: "" },
  },
  smtp: {
    host: { type: String, default: "" },
    port: { type: Number, default: 587 },
    secure: { type: Boolean, default: false },
    user: { type: String, default: "" },
    passEnc: { type: String, default: "" },
    fromName: { type: String, default: "Embrowerment®" },
    fromEmail: { type: String, default: "" },
  },
  // Embrowerment Foundation (separate website, same backend)
  foundation: {
    name: { type: String, default: "Embrowerment Foundation" },
    legalName: { type: String, default: "Embrowerment Foundation" },
    ein: { type: String, default: "" },                          // printed on donation receipts
    siteUrl: { type: String, default: "" },                      // e.g. https://embrowermentfoundation.org
    allowedOrigins: { type: [String], default: [] },             // CORS for the foundation site
    successPath: { type: String, default: "/thank-you" },
    cancelPath: { type: String, default: "/donate" },
    notifyEmail: { type: String, default: "" },                  // new donation + contact alerts
    currency: { type: String, default: "usd" },
    presetAmounts: { type: [Number], default: [10, 20, 30, 40] },
    minAmount: { type: Number, default: 1 },
    maxAmount: { type: Number, default: 50000 },
    feePercent: { type: Number, default: 3 },
    frequencies: { type: [String], default: ["one-time", "monthly", "quarterly", "annual"] },
    designations: { type: [{ key: String, label: String, active: { type: Boolean, default: true }, _id: false }],
      default: [{ key: "general", label: "Where it is needed most", active: true }, { key: "first-20", label: "The First 20 Initiative", active: true }] },
    contactReasons: { type: [String], default: ["General inquiry", "Donations & giving", "Partnerships", "Volunteering", "Press & media", "Services & eligibility", "Other"] },
    receiptNote: { type: String, default: "Embrowerment Foundation is an IRS-recognized 501(c)(3) public charity. Donations are tax-deductible to the fullest extent permitted by law. No goods or services were provided in exchange for this contribution." },
    // Optional separate Stripe account for the foundation; falls back to the store's keys when empty.
    stripe: {
      publishableKey: { type: String, default: "" },
      secretKeyEnc: { type: String, default: "" },
      webhookSecretEnc: { type: String, default: "" },
    },
  },
}, { timestamps: true });

export const Setting = mongoose.model("Setting", settingSchema);

let cache = null;
export async function getSettings() {
  if (cache) return cache;
  cache = await Setting.findById("main").lean() || (await Setting.create({ _id: "main" })).toObject();
  return cache;
}
export const clearSettingsCache = () => { cache = null; };

export async function getSecrets() {
  const s = await getSettings();
  return {
    stripeSecret: decrypt(s.stripe.secretKeyEnc),
    stripeWebhookSecret: decrypt(s.stripe.webhookSecretEnc),
    smtpPass: decrypt(s.smtp.passEnc),
    foundationStripeSecret: decrypt(s.foundation?.stripe?.secretKeyEnc),
    foundationWebhookSecret: decrypt(s.foundation?.stripe?.webhookSecretEnc),
  };
}

/** Admin-safe view: secrets masked. */
export async function publicSettings() {
  const s = await getSettings(); const x = await getSecrets();
  return {
    store: s.store,
    stripe: { mode: s.stripe.mode, publishableKey: s.stripe.publishableKey, secretKey: mask(x.stripeSecret), webhookSecret: mask(x.stripeWebhookSecret), configured: !!x.stripeSecret },
    smtp: { ...s.smtp, passEnc: undefined, pass: x.smtpPass ? "••••••••" : "", configured: !!(s.smtp.host && s.smtp.fromEmail) },
    foundation: (() => { const f = s.foundation || {}; const { stripe: fs = {}, ...rest } = f;
      return { ...rest, stripe: { publishableKey: fs.publishableKey || "", secretKey: mask(x.foundationStripeSecret), webhookSecret: mask(x.foundationWebhookSecret), separateAccount: !!x.foundationStripeSecret } }; })(),
  };
}

export async function updateSettings(patch) {
  const s = await Setting.findById("main") || new Setting({ _id: "main" });
  if (patch.store) Object.assign(s.store, patch.store);
  if (patch.stripe) {
    const { secretKey, webhookSecret, ...rest } = patch.stripe;
    Object.assign(s.stripe, rest);
    if (secretKey !== undefined) s.stripe.secretKeyEnc = encrypt(secretKey);
    if (webhookSecret !== undefined) s.stripe.webhookSecretEnc = encrypt(webhookSecret);
  }
  if (patch.smtp) {
    const { pass, ...rest } = patch.smtp;
    Object.assign(s.smtp, rest);
    if (pass !== undefined) s.smtp.passEnc = encrypt(pass);
  }
  if (patch.foundation) {
    const { stripe: fst, ...rest } = patch.foundation;
    if (!s.foundation) s.foundation = {};
    Object.assign(s.foundation, rest);
    if (fst) {
      if (fst.publishableKey !== undefined) s.foundation.stripe.publishableKey = fst.publishableKey;
      if (fst.secretKey !== undefined) s.foundation.stripe.secretKeyEnc = encrypt(fst.secretKey);
      if (fst.webhookSecret !== undefined) s.foundation.stripe.webhookSecretEnc = encrypt(fst.webhookSecret);
    }
  }
  await s.save(); clearSettingsCache();
}
