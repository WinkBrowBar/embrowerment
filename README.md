# Embrowerment® — storefront, API & admin

```
web/     TanStack Start (React 19) storefront — home, The Method, PMU, policies, shop, academy, cart, account
server/  Node.js + Express 5 + MongoDB (Mongoose) API — auth, catalog, cart, wishlist, coupons, orders, Stripe, SMTP
admin/   React + Vite admin panel — dashboard, orders, products, courses, coupons, customers, settings
```
admin@embrowerment.com
ChangeMe123!
## Run locally

Requires Node 20+ and MongoDB (local `mongod` or a MongoDB Atlas URI).

```sh
# 1. API
cd server
cp .env.example .env          # set MONGO_URI, JWT_SECRET, ENCRYPTION_KEY, ADMIN_EMAIL/PASSWORD
npm install
npm run seed                  # admin account + 8 products + 4 courses + WELCOME10 coupon
npm run seed:demo             # optional: 5 demo customers, 11 orders, 5 coupons, wishlists
npm run dev                   # http://localhost:4000

# 2. Storefront
cd ../web
cp .env.example .env          # VITE_API_URL=http://localhost:4000
npm install && npm run dev    # http://localhost:8080

# 3. Admin
cd ../admin
cp .env.example .env          # VITE_API_URL=http://localhost:4000
npm install && npm run dev    # http://localhost:5175 — sign in with ADMIN_EMAIL / ADMIN_PASSWORD
```

## Demo logins (after `npm run seed:demo`)

| Role | Email | Password |
|---|---|---|
| Customer | sofia@demo.embrowerment.com | Demo1234! |
| Admin | value of `ADMIN_EMAIL` in `server/.env` (default admin@embrowerment.com) | value of `ADMIN_PASSWORD` (default ChangeMe123!) |

Other demo customers (same password): maya@, olivia@, priya@, hannah@demo.embrowerment.com.
Re-running `seed:demo` resets only the demo customers and their orders. Don't run it on production.

## Configure payments & email (in the admin panel → Settings)

**Stripe**
1. Paste the **secret key** (`sk_test_…` / `sk_live_…`) and publishable key, then **Test connection**.
2. In Stripe → Developers → Webhooks, add endpoint `https://YOUR-API/api/webhooks/stripe` with events
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`, `charge.refunded`.
3. Paste the signing secret (`whsec_…`) and save.
   Local testing: `stripe listen --forward-to localhost:4000/api/webhooks/stripe` and use the `whsec_` it prints.

**SMTP** — host, port, user, password, from address → **Send test**. Emails: welcome, password reset,
order confirmation, order status updates, new-order alert (Store → New-order alert email).

Secrets (Stripe keys, SMTP password) are stored AES-256-GCM encrypted with `ENCRYPTION_KEY` and never returned
to the browser in full. **Don't change `ENCRYPTION_KEY` after saving keys** (you'd have to re-enter them).

## How it works

- **Prices are always computed on the server** (`server/src/lib/pricing.js`) — cart totals, coupon discounts,
  shipping (flat rate / free-over threshold), tax rate and stock checks. The browser only sends ids and quantities.
- **Checkout** creates a pending order, then a Stripe Checkout Session (card, shipping address for physical items).
  The coupon discount is passed to Stripe as a one-off exact-amount coupon, so Stripe's total matches the order.
- **Fulfilment** (`server/src/lib/fulfill.js`) runs from the webhook *and* from the success page, idempotently per
  step: stock decremented once, coupon usage counted once, courses unlocked, cart cleared, emails sent.
- **Courses**: buying a course grants access in the customer's account (`/account?tab=courses` → `/learn/:slug`).
  Lesson video URLs (YouTube, Vimeo or .mp4) are only sent to owners; lessons marked *Free preview* are public.
  Admins can grant/revoke course access manually under Customers.
- **Auth**: email + password (bcrypt), JWT in an httpOnly cookie, password reset by emailed one-hour link,
  changing/resetting a password signs out other sessions. Guest carts live in the browser and merge on login.
- **Coupons**: percent or fixed, products/courses/all, min spend, total uses, per-customer limit, start/expiry.

## Embrowerment Foundation (second website, same backend)

Donations (Stripe, one-time or recurring) and the contact form for the Foundation site are served from
`/api/foundation/*`. Configure it in **Admin → Settings → Embrowerment Foundation**; manage it under
**Foundation · Donations** and **Foundation · Messages**. Integration guide with drop-in code:
[`docs/FOUNDATION_API.md`](docs/FOUNDATION_API.md).

## Deploying

- Serve the API over HTTPS and set `COOKIE_SECURE=true`, `NODE_ENV=production`, and the real
  `CLIENT_URL`, `ADMIN_URL`, `API_URL`. With `COOKIE_SECURE=true` cookies are `SameSite=None; Secure`, so the
  storefront/admin can be on different domains than the API. Hosting all three under one domain
  (e.g. `embrowerment.com`, `admin.embrowerment.com`, `api.embrowerment.com`) is recommended.
- `server/uploads/` holds images uploaded in the admin — use a persistent disk (or swap `admin.js` upload
  storage for S3). Seed images live in `server/uploads/seed/`.
- Point the storefront and admin at the API with `VITE_API_URL` at build time.

## Content still to provide

- Course lesson videos (Admin → Courses → lessons → Video URL) and course descriptions.
- Returns policy wording (`web/src/routes/returns.tsx`), The Method page copy (currently mirrors embrowerment.com).
- Product photography beyond the single cut-out image per product (Admin → Products → Images).
