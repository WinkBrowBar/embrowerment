# Embrowerment Foundation API — integration guide

The Foundation website (e.g. `embrowermentfoundation.org`) uses the **same backend** as the Embrowerment store.
It only needs two things from it: **donations** (Stripe) and the **contact form**. Everything is managed in the
admin panel under **Foundation · Donations**, **Foundation · Messages** and **Settings → Embrowerment Foundation**.

```
Foundation site (any stack)  ──HTTPS──▶  https://api.embrowerment.com/api/foundation/*
                                            │
                          Stripe Checkout ◀─┘   (donor pays on Stripe's hosted page)
                                            │
             Stripe webhooks ──────────────▶ /api/webhooks/stripe-foundation
```

No login, cookies or API key are needed on the foundation site. Access is limited by **CORS** (only your foundation
domain may call these endpoints from a browser) and rate limits.

---

## 1. One-time setup

### In the admin panel → Settings → Embrowerment Foundation
| Field | Example | Why |
|---|---|---|
| Foundation site URL | `https://embrowermentfoundation.org` | Allowed to call the API (CORS) and where Stripe sends donors back |
| Extra allowed origins | `https://www.embrowermentfoundation.org, http://localhost:3000` | Other domains / local dev |
| Thank-you page path | `/thank-you` | Stripe returns here after payment |
| Cancel page path | `/donate` | Stripe returns here if the donor cancels |
| Legal name, EIN, Receipt note | | Printed on the emailed tax receipt |
| Alerts email | `hello@embrowerment.com` | Gets new-donation and contact-form alerts |
| Preset amounts, fee %, min/max, frequencies | `10,20,30,40` · `3` | Returned by `/config` to build the form |
| Designations | `general` → "Where it is needed most", `first-20` → "The First 20 Initiative" | "Direct my gift to" options |
| Contact form reasons | `General inquiry, Partnerships, …` | "Reason for contact" dropdown |
| Stripe for donations | foundation's `sk_live_…`, `whsec_…` | Optional. Leave blank to use the store's Stripe account |

Also make sure **Email (SMTP)** is configured — donors get receipts by email.

### In Stripe (the account used for donations)
1. **Developers → Webhooks → Add endpoint**
   - If the foundation has **its own Stripe account**: `https://YOUR-API/api/webhooks/stripe-foundation`
   - If it **shares the store's account**: no new endpoint needed — add the events below to the existing
     `/api/webhooks/stripe` endpoint.
2. Events: `checkout.session.completed`, `checkout.session.expired`, `invoice.paid`, `invoice.payment_failed`,
   `customer.subscription.deleted`, `charge.refunded`.
3. Paste the signing secret (`whsec_…`) into the admin settings and save.

Local testing: `stripe listen --forward-to localhost:4000/api/webhooks/stripe-foundation`.

---

## 2. Endpoints

Base URL: `https://YOUR-API/api/foundation` (shown in the admin under Settings → Embrowerment Foundation).
All request/response bodies are JSON. Errors return `4xx/5xx` with `{ "error": "message", "details"?: [{ "path", "message" }] }`.

### `GET /config`
Everything needed to render both forms.
```json
{
  "name": "Embrowerment Foundation",
  "currency": "usd",
  "designations": [
    { "key": "general", "label": "Where it is needed most" },
    { "key": "first-20", "label": "The First 20 Initiative" }
  ],
  "presetAmounts": [10, 20, 30, 40],
  "minAmount": 1, "maxAmount": 50000, "feePercent": 3,
  "frequencies": ["one-time", "monthly", "quarterly", "annual"],
  "contactReasons": ["General inquiry", "Donations & giving", "Partnerships", "…"],
  "receiptNote": "Embrowerment Foundation is an IRS-recognized 501(c)(3) public charity. …"
}
```

### `POST /donations/quote` *(optional)*
```json
// request
{ "amount": 20, "coverFee": true }
// response
{ "amount": 20, "fee": 0.6, "total": 20.6 }
```
Fee = `amount × feePercent / 100`, rounded to cents. You can compute this in the browser instead; the server always
recalculates at checkout.

### `POST /donations/checkout`
Creates a Stripe Checkout Session and returns its URL. **Redirect the browser to `url`.**
```json
// request
{
  "designation": "general",          // a key from /config.designations (required)
  "amount": 20,                      // gift amount in dollars (required)
  "frequency": "one-time",           // one-time | monthly | quarterly | annual
  "coverFee": true,                  // add feePercent on top
  "email": "donor@example.com",      // optional — Stripe asks if missing
  "name": "Dana Donor",              // optional
  "anonymous": false,                // optional — hides the name on the thank-you page
  "note": "In honor of…",            // optional, ≤ 500 chars
  "successUrl": "https://embrowermentfoundation.org/thank-you",  // optional, must be on your site
  "cancelUrl":  "https://embrowermentfoundation.org/donate"      // optional, must be on your site
}
// 201 response
{ "url": "https://checkout.stripe.com/c/pay/cs_…", "sessionId": "cs_…", "number": "FND-100003", "amount": 20, "fee": 0.6, "total": 20.6 }
```
- **One-time** → a single card payment.
- **Monthly / Quarterly / Annual** → a Stripe subscription billed every 1, 3 or 12 months. Each renewal is recorded
  on the donation and the donor gets a receipt email for every charge.
- Stripe appends `?session_id=cs_…` to the success URL.

### `GET /donations/session/:sessionId`
For the thank-you page. Confirms with Stripe if the webhook hasn't arrived yet. Returns no personal data except the
first name (and none if anonymous).
```json
{ "donation": { "number": "FND-100003", "status": "paid", "amount": 20, "fee": 0.6, "total": 20.6,
  "frequency": "one-time", "designation": "Where it is needed most", "firstName": "Dana", "createdAt": "…" } }
```
`status`: `pending` (still processing — poll every 2s) · `paid` (one-time) · `active` (recurring) · `cancelled` · `failed` · `refunded`.

### `POST /contact`
```json
// request
{
  "name": "Ana Lopez",                 // required
  "organization": "Acme Clinic",       // optional
  "email": "ana@example.com",          // required
  "phone": "+1 646 555 0100",          // optional
  "reason": "Partnerships",            // required — one of /config.contactReasons
  "message": "Hello…",                 // required, ≤ 5000 chars
  "website": ""                        // honeypot — keep a hidden empty input with this name
}
// 201 response
{ "ok": true, "id": "…", "message": "Thank you — your message has been received." }
// 400 response (validation)
{ "error": "Invalid input", "details": [{ "path": "email", "message": "Enter a valid email" }] }
```
The message appears in **Admin → Foundation · Messages**, the alerts email is notified, and the sender gets an
acknowledgement email.

Rate limits: checkout 20 requests / 10 min per IP · contact 10 / hour per IP (`429` when exceeded).

---

## 3. Drop-in code

Set once:
```js
const API = "https://api.embrowerment.com/api/foundation";   // your API URL
```

### 3a. Donation form (matches the design: gift designation · amount · custom · frequency · cover fee · total)
```html
<form id="donate">
  <p class="label">Direct my gift to</p>   <div id="designations" class="choices"></div>
  <p class="label">Amount</p>              <div id="amounts" class="choices"></div>
  <label class="custom">$ <input id="custom" inputmode="decimal" placeholder="Custom amount"></label>
  <p class="label">Frequency</p>           <div id="frequencies" class="choices"></div>
  <label class="check"><input type="checkbox" id="coverFee" checked>
    <span>Cover the <span id="feePct">3</span>% transaction fee so more of my gift goes to the mission</span></label>
  <dl><dt>Transaction fee</dt><dd id="fee">$0.00</dd><dt>Total per donation</dt><dd id="total">$0.00</dd></dl>
  <button type="submit" id="donateBtn">Donate now</button>
  <p id="donateError" role="alert" hidden></p>
  <p id="receiptNote" class="small"></p>
</form>

<script type="module">
const API = "https://api.embrowerment.com/api/foundation";
const $ = (id) => document.getElementById(id);
const money = (n) => `$${n.toFixed(2)}`;
const cfg = await fetch(`${API}/config`).then(r => r.json());
const state = { designation: cfg.designations[0]?.key, amount: cfg.presetAmounts[1] ?? cfg.presetAmounts[0], frequency: cfg.frequencies[0] };
const LABEL = { "one-time": "One-time", monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" };

function choices(el, items, key) {
  el.innerHTML = "";
  for (const { value, label } of items) {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = label; b.className = state[key] === value ? "on" : "";
    b.onclick = () => { state[key] = value; if (key === "amount") $("custom").value = ""; render(); };
    el.append(b);
  }
}
function render() {
  choices($("designations"), cfg.designations.map(d => ({ value: d.key, label: d.label })), "designation");
  choices($("amounts"), cfg.presetAmounts.map(a => ({ value: a, label: `$${a}` })), "amount");
  choices($("frequencies"), cfg.frequencies.map(f => ({ value: f, label: LABEL[f] })), "frequency");
  const amount = Number($("custom").value) || state.amount || 0;
  const fee = $("coverFee").checked ? Math.round(amount * cfg.feePercent) / 100 : 0;
  $("fee").textContent = money(fee); $("total").textContent = money(amount + fee);
}
$("feePct").textContent = cfg.feePercent;
$("receiptNote").textContent = cfg.receiptNote;
$("custom").oninput = () => { state.amount = null; render(); };
$("coverFee").onchange = render;
render();

$("donate").onsubmit = async (e) => {
  e.preventDefault();
  const amount = Number($("custom").value) || state.amount;
  $("donateBtn").disabled = true; $("donateError").hidden = true;
  try {
    const res = await fetch(`${API}/donations/checkout`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designation: state.designation, amount, frequency: state.frequency, coverFee: $("coverFee").checked }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    location.href = data.url;                       // → Stripe Checkout
  } catch (err) {
    $("donateError").textContent = err.message; $("donateError").hidden = false; $("donateBtn").disabled = false;
  }
};
</script>
```

### 3b. Thank-you page (`/thank-you`)
```html
<h1 id="ty">Confirming your gift…</h1><p id="tyDetail"></p>
<script type="module">
const API = "https://api.embrowerment.com/api/foundation";
const id = new URLSearchParams(location.search).get("session_id");
async function check(tries = 0) {
  const r = await fetch(`${API}/donations/session/${id}`); const { donation: d, error } = await r.json();
  if (error) { document.getElementById("ty").textContent = "We couldn't find that donation."; return; }
  if (d.status === "pending" && tries < 10) return setTimeout(() => check(tries + 1), 2000);
  document.getElementById("ty").textContent = `Thank you${d.firstName ? `, ${d.firstName}` : ""}.`;
  document.getElementById("tyDetail").textContent =
    `Your ${d.frequency === "one-time" ? "" : d.frequency + " "}gift of $${d.total.toFixed(2)} to ${d.designation} is confirmed (receipt ${d.number}). A tax receipt is on its way to your inbox.`;
}
if (id) check();
</script>
```

### 3c. Contact form (name · organization · email · phone · reason · message)
```html
<form id="contact" novalidate>
  <p>Fields marked * are required.</p>
  <label>Name *<input name="name" required></label>
  <label>Organization <em>(Optional)</em><input name="organization"></label>
  <label>Email *<input name="email" type="email" required></label>
  <label>Phone <em>(Optional)</em><input name="phone" type="tel"></label>
  <label>Reason for contact *<select name="reason" id="reason" required><option value="">Select a reason</option></select></label>
  <label>Message *<textarea name="message" rows="6" required></textarea></label>
  <!-- honeypot: hidden from people, bots fill it -->
  <input name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
  <p class="privacy"><b>Privacy note:</b> Please do not submit medical records, financial information, or other sensitive personal information through this form.</p>
  <button type="submit">Send message</button>
  <p id="contactStatus" role="status"></p>
</form>

<script type="module">
const API = "https://api.embrowerment.com/api/foundation";
const form = document.getElementById("contact"), status = document.getElementById("contactStatus");
const { contactReasons } = await fetch(`${API}/config`).then(r => r.json());
for (const r of contactReasons) document.getElementById("reason").append(new Option(r, r));

form.onsubmit = async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const body = Object.fromEntries(new FormData(form));
  form.querySelector("button").disabled = true; status.textContent = "Sending…";
  const res = await fetch(`${API}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (res.ok) { form.reset(); status.textContent = data.message; }
  else status.textContent = data.details?.map(d => d.message).join(" · ") || data.error;
  form.querySelector("button").disabled = false;
};
</script>
```

### 3d. React / Next.js
The calls are the same; for example:
```tsx
const API = process.env.NEXT_PUBLIC_FOUNDATION_API!;   // https://api.embrowerment.com/api/foundation

export async function startDonation(input: { designation: string; amount: number; frequency: "one-time" | "monthly" | "quarterly" | "annual"; coverFee: boolean }) {
  const res = await fetch(`${API}/donations/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  window.location.href = data.url;
}

export async function sendContact(form: { name: string; email: string; reason: string; message: string; organization?: string; phone?: string }) {
  const res = await fetch(`${API}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error), { details: data.details });
  return data;
}
```
If you call the API from a server (Next.js route handler / server action) instead of the browser, CORS doesn't apply.

---

## 4. What happens after a donation

| Event | Result |
|---|---|
| Donor completes Stripe Checkout | Donation → `paid` (one-time) or `active` (recurring); receipt emailed; alert to the Alerts email |
| Recurring renewal (`invoice.paid`) | Payment added to the donation's history; receipt emailed |
| Card fails on renewal | Donation → `failed` (Stripe retries automatically; back to `active` on success) |
| Subscription cancelled (admin or Stripe) | Donation → `cancelled` |
| Refund | One-time donation → `refunded` |

Admins can, from **Foundation · Donations**: search/filter, view payment history, resend a receipt, cancel a
recurring gift, refund the latest payment. **Foundation · Messages** is an inbox with statuses
(new, read, replied, archived, spam), internal notes and one-click email reply.

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| Browser console: *blocked by CORS policy* | Add the exact origin (scheme + host + port) to Foundation site URL or Extra allowed origins |
| `503 Donations are not configured yet` | Add a Stripe secret key (store or foundation) in Settings |
| `400 Foundation site URL is not configured` | Set Foundation site URL in Settings |
| Thank-you page stays on "Confirming…" | Webhook not reaching the API — check the endpoint URL and signing secret in Stripe → Webhooks |
| No receipt emails | Configure Settings → Email (SMTP) and use "Send test" |
