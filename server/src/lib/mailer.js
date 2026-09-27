import nodemailer from "nodemailer";
import { getSettings, getSecrets } from "../models/Setting.js";
import * as T from "../templates/emails.js";

async function transport() {
  const s = await getSettings();
  const { smtpPass } = await getSecrets();
  if (!s.smtp.host || !s.smtp.fromEmail) return null;
  return {
    t: nodemailer.createTransport({ host: s.smtp.host, port: s.smtp.port, secure: s.smtp.secure, auth: s.smtp.user ? { user: s.smtp.user, pass: smtpPass } : undefined }),
    from: `"${s.smtp.fromName || s.store.name}" <${s.smtp.fromEmail}>`,
    store: s.store,
  };
}

/** Sends an email; never throws (logs instead) unless `strict`. Returns true if sent. */
export async function sendMail({ to, subject, html }, { strict = false } = {}) {
  try {
    const x = await transport();
    if (!x) { if (strict) throw new Error("SMTP is not configured"); console.warn(`[mail] SMTP not configured — skipped "${subject}" to ${to}`); return false; }
    await x.t.sendMail({ from: x.from, to, subject, html });
    return true;
  } catch (e) {
    if (strict) throw e;
    console.error("[mail] failed:", e.message); return false;
  }
}

export async function verifySmtp(to) {
  const x = await transport();
  if (!x) throw new Error("SMTP host and From email are required");
  await x.t.verify();
  await x.t.sendMail({ from: x.from, to, subject: "SMTP test — Embrowerment®", html: T.layout("SMTP is working", "<p>This is a test email from your Embrowerment® admin panel.</p>") });
}

export const emails = {
  welcome: (user) => sendMail({ to: user.email, subject: "Welcome to Embrowerment®", html: T.welcome(user) }),
  reset: (user, url) => sendMail({ to: user.email, subject: "Reset your password", html: T.reset(user, url) }),
  orderConfirmed: (order) => sendMail({ to: order.email, subject: `Order ${order.number} confirmed`, html: T.orderConfirmed(order) }),
  orderStatus: (order) => sendMail({ to: order.email, subject: `Order ${order.number}: ${order.status}`, html: T.orderStatus(order) }),
  donationReceipt: async (d) => { const s = await getSettings(); return d.donor?.email ? sendMail({ to: d.donor.email, subject: `Your gift to ${s.foundation.name} — receipt ${d.number}`, html: T.donationReceipt(d, s.foundation) }) : false; },
  donationAlert: async (d) => { const s = await getSettings(); const to = s.foundation.notifyEmail || s.store.notifyEmail; if (to) await sendMail({ to, subject: `New donation ${d.number} — $${d.total.toFixed(2)} (${d.frequency})`, html: T.donationAlert(d) }); },
  contactAck: async (m) => { const s = await getSettings(); return sendMail({ to: m.email, subject: `We received your message — ${s.foundation.name}`, html: T.contactAck(m, s.foundation) }); },
  contactAlert: async (m) => { const s = await getSettings(); const to = s.foundation.notifyEmail || s.store.notifyEmail; if (to) await sendMail({ to, subject: `[Foundation] ${m.reason} — ${m.name}`, html: T.contactAlert(m) }); },
  adminNewOrder: async (order) => { const s = await getSettings(); if (s.store.notifyEmail) await sendMail({ to: s.store.notifyEmail, subject: `New order ${order.number} — $${order.total.toFixed(2)}`, html: T.orderConfirmed(order, true) }); },
};
