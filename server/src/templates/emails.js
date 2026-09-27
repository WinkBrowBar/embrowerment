import { config } from "../config.js";

const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export const layout = (title, body) => `<!doctype html><html><body style="margin:0;background:#f4f2ee;font-family:Helvetica,Arial,sans-serif;color:#222">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff">
<tr><td style="background:#222;color:#fff;padding:22px 28px;font-weight:700;letter-spacing:.18em;font-size:14px">EMBROWERMENT</td></tr>
<tr><td style="padding:32px 28px"><h1 style="margin:0 0 18px;font-size:26px;letter-spacing:-.02em">${esc(title)}</h1>${body}</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #eee;font-size:12px;color:#777">Embrowerment® Concierge · 646.798.2723 · hello@embrowerment.com</td></tr>
</table></td></tr></table></body></html>`;

const btn = (href, label) => `<p style="margin:26px 0"><a href="${esc(href)}" style="background:#222;color:#fff;text-decoration:none;padding:14px 26px;font-family:Courier,monospace">${esc(label)}</a></p>`;

export const welcome = (u) => layout(`Welcome${u.name ? `, ${u.name}` : ""}.`, `<p>Your Embrowerment® account is ready. Confidence begins in the eye zone.</p>${btn(`${config.clientUrl}/account`, "Go to your account")}`);

export const reset = (u, url) => layout("Reset your password", `<p>We received a request to reset the password for ${esc(u.email)}. This link expires in 1 hour.</p>${btn(url, "Reset password")}<p style="color:#777;font-size:13px">If you didn't ask for this, you can ignore this email.</p>`);

const itemsTable = (o) => `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
${o.items.map(i => `<tr><td style="padding:10px 0;border-bottom:1px solid #eee">${esc(i.name)}${i.variant ? ` <span style="color:#777">— ${esc(i.variant)}</span>` : ""} × ${i.qty}</td><td align="right" style="padding:10px 0;border-bottom:1px solid #eee">${money(i.price * i.qty)}</td></tr>`).join("")}
<tr><td style="padding:8px 0">Subtotal</td><td align="right">${money(o.subtotal)}</td></tr>
${o.discount ? `<tr><td style="padding:4px 0">Discount${o.coupon?.code ? ` (${esc(o.coupon.code)})` : ""}</td><td align="right">−${money(o.discount)}</td></tr>` : ""}
${o.shipping ? `<tr><td style="padding:4px 0">Shipping</td><td align="right">${money(o.shipping)}</td></tr>` : ""}
${o.tax ? `<tr><td style="padding:4px 0">Tax</td><td align="right">${money(o.tax)}</td></tr>` : ""}
<tr><td style="padding:10px 0;font-weight:700">Total</td><td align="right" style="font-weight:700">${money(o.total)}</td></tr></table>`;

export const orderConfirmed = (o, admin = false) => layout(admin ? `New order ${o.number}` : "Thank you for your order.",
  `<p>${admin ? `From ${esc(o.email)}.` : `Order <b>${esc(o.number)}</b> is confirmed.`}</p>${itemsTable(o)}
  ${o.items.some(i => i.kind === "course") && !admin ? `<p>Your courses are available now in your account.</p>` : ""}
  ${btn(admin ? `${config.clientUrl}` : `${config.clientUrl}/account`, admin ? "Open store" : "View your order")}`);

export const orderStatus = (o) => layout(`Order ${o.number}`, `<p>Your order status is now <b>${esc(o.status)}</b>.</p>${o.trackingNumber ? `<p>Tracking number: <b>${esc(o.trackingNumber)}</b></p>` : ""}${btn(`${config.clientUrl}/account`, "View your order")}`);

export const donationReceipt = (d, f) => layout(`Thank you${d.donor?.name ? `, ${d.donor.name.split(" ")[0]}` : ""}.`, `
  <p>Your ${d.frequency === "one-time" ? "gift" : `${esc(d.frequency)} gift`} to <b>${esc(f.name)}</b> has been received.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee">Receipt</td><td align="right" style="border-bottom:1px solid #eee">${esc(d.number)}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee">Date</td><td align="right" style="border-bottom:1px solid #eee">${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee">Directed to</td><td align="right" style="border-bottom:1px solid #eee">${esc(d.designation?.label || "")}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee">Gift</td><td align="right" style="border-bottom:1px solid #eee">${money(d.amount)}</td></tr>
    ${d.fee ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">Transaction fee covered</td><td align="right" style="border-bottom:1px solid #eee">${money(d.fee)}</td></tr>` : ""}
    <tr><td style="padding:10px 0;font-weight:700">Total${d.frequency !== "one-time" ? ` per ${d.frequency === "monthly" ? "month" : d.frequency === "quarterly" ? "quarter" : "year"}` : ""}</td><td align="right" style="font-weight:700">${money(d.total)}</td></tr>
  </table>
  <p style="color:#555;font-size:13px;margin-top:22px">${esc(f.legalName || f.name)}${f.ein ? ` · EIN ${esc(f.ein)}` : ""}<br>${esc(f.receiptNote || "")}</p>`);

export const contactAck = (m, f) => layout("We received your message.", `<p>Thank you for contacting ${esc(f.name)}, ${esc(m.name)}. Our team will get back to you soon.</p><p style="color:#777;font-size:13px">Reason: ${esc(m.reason)}</p>`);

export const contactAlert = (m) => layout(`New message: ${m.reason}`, `<p><b>${esc(m.name)}</b>${m.organization ? ` · ${esc(m.organization)}` : ""}<br><a href="mailto:${esc(m.email)}">${esc(m.email)}</a>${m.phone ? ` · ${esc(m.phone)}` : ""}</p><p style="white-space:pre-wrap">${esc(m.message)}</p>`);

export const donationAlert = (d) => layout(`New donation ${money(d.total)}`, `<p>${esc(d.donor?.name || "Anonymous")} (${esc(d.donor?.email || "")}) · ${esc(d.frequency)} · ${esc(d.designation?.label || "")}</p><p>Receipt ${esc(d.number)}</p>`);
