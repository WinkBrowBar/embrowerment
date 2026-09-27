import { useEffect, useState } from "react";
import { api } from "../api";
import { Page, Field, Toggle, toast } from "../components/ui";

export function Settings() {
  const [s, setS] = useState<any>(null); const [hook, setHook] = useState(""); const [fhook, setFhook] = useState(""); const [apiUrl, setApiUrl] = useState("");
  const [tab, setTab] = useState<"store" | "stripe" | "smtp" | "foundation">("stripe");
  const [fsec, setFsec] = useState({ secretKey: "", webhookSecret: "" });
  const [secret, setSecret] = useState({ secretKey: "", webhookSecret: "", smtpPass: "" });
  const [testTo, setTestTo] = useState(""); const [busy, setBusy] = useState(false);
  const load = () => api("/admin/settings").then(d => { setS(d.settings); setHook(d.webhookUrl); setFhook(d.foundationWebhookUrl); setApiUrl(d.apiUrl); }).catch(toast.err);
  useEffect(() => { load(); }, []);
  if (!s) return <Page title="Settings"><p className="muted">Loading…</p></Page>;
  const set = (g: string, k: string, v: unknown) => setS((x: any) => ({ ...x, [g]: { ...x[g], [k]: v } }));

  const save = async () => {
    setBusy(true);
    try {
      const body: any = {};
      if (tab === "store") body.store = { ...s.store, shippingCountries: String(s.store.shippingCountries).split(",").map((c: string) => c.trim()).filter(Boolean) };
      if (tab === "stripe") body.stripe = { mode: s.stripe.mode, publishableKey: s.stripe.publishableKey, ...(secret.secretKey && { secretKey: secret.secretKey }), ...(secret.webhookSecret && { webhookSecret: secret.webhookSecret }) };
      if (tab === "foundation") {
        const f = s.foundation; const list = (v: any) => Array.isArray(v) ? v : String(v).split(/[\n,]/).map((x: string) => x.trim()).filter(Boolean);
        body.foundation = { name: f.name, legalName: f.legalName, ein: f.ein, siteUrl: f.siteUrl, allowedOrigins: list(f.allowedOrigins), successPath: f.successPath, cancelPath: f.cancelPath,
          notifyEmail: f.notifyEmail, currency: f.currency, presetAmounts: list(f.presetAmounts).map(Number), minAmount: f.minAmount, maxAmount: f.maxAmount, feePercent: f.feePercent,
          frequencies: f.frequencies, designations: f.designations, contactReasons: list(f.contactReasons), receiptNote: f.receiptNote,
          stripe: { publishableKey: f.stripe.publishableKey, ...(fsec.secretKey && { secretKey: fsec.secretKey }), ...(fsec.webhookSecret && { webhookSecret: fsec.webhookSecret }) } };
      }
      if (tab === "smtp") { const { pass, configured, ...rest } = s.smtp; void pass; void configured; body.smtp = { ...rest, ...(secret.smtpPass && { pass: secret.smtpPass }) }; }
      const d = await api("/admin/settings", { method: "PUT", body });
      setS(d.settings); setSecret({ secretKey: "", webhookSecret: "", smtpPass: "" }); setFsec({ secretKey: "", webhookSecret: "" }); toast.ok("Settings saved");
    } catch (e) { toast.err(e); } finally { setBusy(false); }
  };
  const test = async (kind: "smtp" | "stripe") => {
    try { const d = await api(`/admin/settings/test-${kind}`, { body: kind === "smtp" ? { to: testTo } : {} }); toast.ok(d.message); } catch (e) { toast.err(e); }
  };

  return <Page title="Settings" actions={<button className="btn primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>}>
    <div className="tabs">{(["stripe", "smtp", "store", "foundation"] as const).map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t === "smtp" ? "Email (SMTP)" : t === "stripe" ? "Payments (Stripe)" : t === "foundation" ? "Embrowerment Foundation" : "Store"}</button>)}</div>

    {tab === "stripe" && <div className="two wide-left"><section className="card grid-form">
      <div className="field wide"><span>Status</span><p>{s.stripe.configured ? <span className="ok">● Secret key saved ({s.stripe.mode} mode) — use “Test connection” to verify</span> : <span className="warn">● Not configured — checkout is disabled</span>}</p></div>
      <Field label="Mode"><select value={s.stripe.mode} onChange={e => set("stripe", "mode", e.target.value)}><option value="test">Test</option><option value="live">Live</option></select></Field>
      <Field label="Publishable key"><input value={s.stripe.publishableKey} onChange={e => set("stripe", "publishableKey", e.target.value)} placeholder="pk_test_…" /></Field>
      <Field label="Secret key" hint={s.stripe.secretKey ? `Saved: ${s.stripe.secretKey} — leave blank to keep` : "Stored encrypted"} wide><input type="password" autoComplete="off" value={secret.secretKey} onChange={e => setSecret({ ...secret, secretKey: e.target.value })} placeholder="sk_test_…" /></Field>
      <Field label="Webhook signing secret" hint={s.stripe.webhookSecret ? `Saved: ${s.stripe.webhookSecret} — leave blank to keep` : "From Stripe → Developers → Webhooks"} wide><input type="password" autoComplete="off" value={secret.webhookSecret} onChange={e => setSecret({ ...secret, webhookSecret: e.target.value })} placeholder="whsec_…" /></Field>
      <div className="field wide"><button className="btn" onClick={() => test("stripe")}>Test connection</button></div>
    </section>
      <section className="card"><h2>Webhook setup</h2><ol className="steps">
        <li>In Stripe, open <b>Developers → Webhooks → Add endpoint</b>.</li>
        <li>Endpoint URL:<code className="copy" onClick={() => { navigator.clipboard.writeText(hook); toast.ok("Copied"); }}>{hook}</code></li>
        <li>Events: <code>checkout.session.completed</code>, <code>checkout.session.async_payment_succeeded</code>, <code>checkout.session.expired</code>, <code>charge.refunded</code>. If donations use this same account, also add <code>invoice.paid</code>, <code>invoice.payment_failed</code>, <code>customer.subscription.deleted</code>.</li>
        <li>Copy the signing secret (<code>whsec_…</code>) into the field on the left and save.</li>
      </ol><p className="muted small">Orders also confirm when the customer returns to the success page, so a missed webhook won't lose an order.</p></section></div>}

    {tab === "smtp" && <div className="two wide-left"><section className="card grid-form">
      <div className="field wide"><span>Status</span><p>{s.smtp.configured ? <span className="ok">● Configured</span> : <span className="warn">● Not configured — emails are skipped</span>}</p></div>
      <Field label="SMTP host"><input value={s.smtp.host} onChange={e => set("smtp", "host", e.target.value)} placeholder="smtp.gmail.com" /></Field>
      <Field label="Port"><input type="number" value={s.smtp.port} onChange={e => set("smtp", "port", Number(e.target.value))} /></Field>
      <Field label="Username"><input value={s.smtp.user} onChange={e => set("smtp", "user", e.target.value)} autoComplete="off" /></Field>
      <Field label="Password" hint={s.smtp.pass ? "Saved — leave blank to keep" : "Stored encrypted"}><input type="password" autoComplete="off" value={secret.smtpPass} onChange={e => setSecret({ ...secret, smtpPass: e.target.value })} /></Field>
      <Field label="From name"><input value={s.smtp.fromName} onChange={e => set("smtp", "fromName", e.target.value)} /></Field>
      <Field label="From email"><input type="email" value={s.smtp.fromEmail} onChange={e => set("smtp", "fromEmail", e.target.value)} placeholder="hello@embrowerment.com" /></Field>
      <div className="field wide"><Toggle checked={s.smtp.secure} onChange={v => set("smtp", "secure", v)} label="Use SSL/TLS (port 465)" /></div>
    </section>
      <section className="card"><h2>Send a test email</h2><p className="muted small">Save first, then send a test.</p>
        <Field label="Send to"><input type="email" value={testTo} onChange={e => setTestTo(e.target.value)} placeholder="you@example.com" /></Field>
        <button className="btn" onClick={() => test("smtp")} disabled={!testTo}>Send test</button>
        <h3>Emails sent automatically</h3><ul className="plain"><li>Welcome (on sign-up)</li><li>Password reset</li><li>Order confirmation</li><li>Order status updates</li><li>New-order alert to the store</li></ul>
      </section></div>}

    {tab === "store" && <section className="card grid-form">
      <Field label="Store name"><input value={s.store.name} onChange={e => set("store", "name", e.target.value)} /></Field>
      <Field label="Currency" hint="ISO code, e.g. usd"><input value={s.store.currency} onChange={e => set("store", "currency", e.target.value)} maxLength={3} /></Field>
      <Field label="New-order alert email"><input type="email" value={s.store.notifyEmail} onChange={e => set("store", "notifyEmail", e.target.value)} /></Field>
      <Field label="Tax rate (%)"><input type="number" min="0" step="0.001" value={s.store.taxRate} onChange={e => set("store", "taxRate", e.target.value)} /></Field>
      <Field label="Flat shipping (USD)"><input type="number" min="0" step="0.01" value={s.store.shippingFlat} onChange={e => set("store", "shippingFlat", e.target.value)} /></Field>
      <Field label="Free shipping over (USD)" hint="0 = never free"><input type="number" min="0" step="0.01" value={s.store.freeShippingOver} onChange={e => set("store", "freeShippingOver", e.target.value)} /></Field>
      <Field label="Ship to countries" hint="Comma-separated ISO codes, e.g. US, CA" wide><input value={Array.isArray(s.store.shippingCountries) ? s.store.shippingCountries.join(", ") : s.store.shippingCountries} onChange={e => set("store", "shippingCountries", e.target.value)} /></Field>
    </section>}

    {tab === "foundation" && (() => { const f = s.foundation; const setF = (k: string, v: unknown) => set("foundation", k, v);
      const setDes = (i: number, k: string, v: unknown) => setF("designations", f.designations.map((d: any, j: number) => j === i ? { ...d, [k]: v } : d));
      const txt = (v: any) => Array.isArray(v) ? v.join(", ") : v;
      return <div className="stack">
      <div className="two wide-left"><section className="card grid-form">
        <h2 className="wide">Organization</h2>
        <Field label="Display name"><input value={f.name} onChange={e => setF("name", e.target.value)} /></Field>
        <Field label="Legal name (receipts)"><input value={f.legalName} onChange={e => setF("legalName", e.target.value)} /></Field>
        <Field label="EIN" hint="Printed on tax receipts"><input value={f.ein} onChange={e => setF("ein", e.target.value)} placeholder="12-3456789" /></Field>
        <Field label="Alerts email" hint="New donations & contact messages"><input type="email" value={f.notifyEmail} onChange={e => setF("notifyEmail", e.target.value)} /></Field>
        <Field label="Receipt note" wide><textarea rows={3} value={f.receiptNote} onChange={e => setF("receiptNote", e.target.value)} /></Field>
      </section>
      <section className="card grid-form one">
        <h2>Website</h2>
        <Field label="Foundation site URL" hint="Checkout returns here"><input value={f.siteUrl} onChange={e => setF("siteUrl", e.target.value)} placeholder="https://embrowermentfoundation.org" /></Field>
        <Field label="Extra allowed origins (CORS)" hint="Comma-separated, e.g. https://www.embrowermentfoundation.org, http://localhost:3000"><textarea rows={2} value={txt(f.allowedOrigins)} onChange={e => setF("allowedOrigins", e.target.value)} /></Field>
        <Field label="Thank-you page path"><input value={f.successPath} onChange={e => setF("successPath", e.target.value)} /></Field>
        <Field label="Cancel page path"><input value={f.cancelPath} onChange={e => setF("cancelPath", e.target.value)} /></Field>
        <div className="field"><span>API base URL</span><code className="copy" onClick={() => { navigator.clipboard.writeText(`${apiUrl}/api/foundation`); toast.ok("Copied"); }}>{apiUrl}/api/foundation</code></div>
      </section></div>

      <div className="two wide-left"><section className="card grid-form">
        <h2 className="wide">Donation form</h2>
        <Field label="Preset amounts" hint="Comma-separated"><input value={txt(f.presetAmounts)} onChange={e => setF("presetAmounts", e.target.value)} /></Field>
        <Field label="Covered fee (%)"><input type="number" min="0" step="0.1" value={f.feePercent} onChange={e => setF("feePercent", e.target.value)} /></Field>
        <Field label="Minimum ($)"><input type="number" min="1" value={f.minAmount} onChange={e => setF("minAmount", e.target.value)} /></Field>
        <Field label="Maximum ($)"><input type="number" min="1" value={f.maxAmount} onChange={e => setF("maxAmount", e.target.value)} /></Field>
        <div className="field wide"><span>Frequencies</span><div className="chips">{["one-time", "monthly", "quarterly", "annual"].map(fr => <button key={fr} type="button" className={f.frequencies.includes(fr) ? "on" : ""} onClick={() => setF("frequencies", f.frequencies.includes(fr) ? f.frequencies.filter((x: string) => x !== fr) : [...f.frequencies, fr])}>{fr}</button>)}</div></div>
        <div className="field wide"><div className="row-head"><span>Designations (“Direct my gift to”)</span><button type="button" className="btn small" onClick={() => setF("designations", [...f.designations, { key: "", label: "", active: true }])}>+ Add</button></div>
          <table className="table edit"><thead><tr><th>Label</th><th>Key (API value)</th><th>Active</th><th /></tr></thead><tbody>{f.designations.map((d: any, i: number) => <tr key={i}>
            <td><input value={d.label} onChange={e => setDes(i, "label", e.target.value)} /></td><td><input value={d.key} onChange={e => setDes(i, "key", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></td>
            <td><input type="checkbox" checked={d.active} onChange={e => setDes(i, "active", e.target.checked)} /></td>
            <td><button type="button" className="icon" onClick={() => setF("designations", f.designations.filter((_: any, j: number) => j !== i))}>✕</button></td></tr>)}</tbody></table></div>
        <Field label="Contact form reasons" hint="Comma-separated" wide><textarea rows={2} value={txt(f.contactReasons)} onChange={e => setF("contactReasons", e.target.value)} /></Field>
      </section>
      <section className="card grid-form one">
        <h2>Stripe for donations</h2>
        <p className="muted small">Leave blank to use the store's Stripe account. A 501(c)(3) usually has its own Stripe account — add its keys here to keep funds separate.</p>
        <div className="field"><span>Status</span><p>{f.stripe.separateAccount ? <span className="ok">● Separate foundation account</span> : s.stripe.configured ? <span className="warn">● Using the store's Stripe account</span> : <span className="warn">● Not configured</span>}</p></div>
        <Field label="Publishable key"><input value={f.stripe.publishableKey} onChange={e => setF("stripe", { ...f.stripe, publishableKey: e.target.value })} placeholder="pk_live_…" /></Field>
        <Field label="Secret key" hint={f.stripe.secretKey ? `Saved: ${f.stripe.secretKey} — leave blank to keep` : "Stored encrypted"}><input type="password" autoComplete="off" value={fsec.secretKey} onChange={e => setFsec({ ...fsec, secretKey: e.target.value })} placeholder="sk_live_…" /></Field>
        <Field label="Webhook signing secret" hint={f.stripe.webhookSecret ? `Saved: ${f.stripe.webhookSecret}` : "whsec_… from the foundation account"}><input type="password" autoComplete="off" value={fsec.webhookSecret} onChange={e => setFsec({ ...fsec, webhookSecret: e.target.value })} placeholder="whsec_…" /></Field>
        <div className="field"><span>Webhook URL (foundation account)</span><code className="copy" onClick={() => { navigator.clipboard.writeText(fhook); toast.ok("Copied"); }}>{fhook}</code>
          <small>Events: checkout.session.completed, checkout.session.expired, invoice.paid, invoice.payment_failed, customer.subscription.deleted, charge.refunded</small></div>
      </section></div>
    </div>; })()}
  </Page>;
}
