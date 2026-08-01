# Slogan Studio — E-commerce

Refurbished electronics store built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v3**, **Zustand**, and an **iKhokha** payment integration.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # optional until iKhokha keys exist
npm run dev                        # http://localhost:3000
```

`npm run build && npm start` for production.

## What's in here

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, featured products, condition guide, services promo |
| `/shop` | Full catalogue with category + condition (grade) filters and sorting |
| `/product/[slug]` | Product detail, statically generated per product |
| `/cart` | Full cart page (the slide-in drawer is global) |
| `/checkout` | Delivery form + order summary → iKhokha |
| `/checkout/success` | Order confirmation, also marks the order paid as a fallback |
| `/services`, `/about`, `/warranty`, `/shipping`, `/account` | Info pages |
| `/api/ikhokha/initialize` | Server route that re-prices the cart and opens an iKhokha paylink |
| `/api/ikhokha/webhook` | Server-to-server callback iKhokha hits to confirm payment |

## Architecture

```
src/
  app/            routes (App Router)
  components/     UI — header, footer, hero, product card, cart drawer, sections…
  lib/
    types.ts      domain types (Product, Grade…)
    products.ts   ⭐ MOCK DATA — single source of truth (swap-later)
    cart-store.ts Zustand cart, persisted to localStorage
    ikhokha.ts    ⭐ payment module — the ONLY file that talks to iKhokha
    utils.ts      price formatting, helpers
```

### The data layer (swap-later)

All product data lives in **`src/lib/products.ts`**. Every component reads through the
helper functions (`getFeatured`, `getByCategory`, `getBySlug`…) — nothing hard-codes
products. When the real backend/admin is ready, replace the `PRODUCTS` array (or make
the helpers `async` and fetch) and the rest of the app is untouched.

Product images are currently SVG placeholders in `public/products/`. Drop real device
photos in and update the `images` paths in `products.ts`.

### Payments (iKhokha)

All payment logic is isolated in **`src/lib/ikhokha.ts`**. The app only calls
`createPaylink()` — it never talks to iKhokha directly.

There is **no mock/sandbox mode** — iKhokha's iK Pay API only has `mode: "live"`.
Until `IKHOKHA_APP_ID` / `IKHOKHA_APP_SECRET` are set in `.env.local`,
`/api/ikhokha/initialize` returns a 503 instead of faking a successful checkout.
Get both values from the merchant's **IK Dashboard → Integrations → iK Pay API**
once their account is approved:

```
IKHOKHA_APP_ID=
IKHOKHA_APP_SECRET=
NEXT_PUBLIC_SITE_URL=https://sloganstudio.co.za
```

**Flow:** `/api/ikhokha/initialize` re-prices every cart item from the database
(never trusts client-submitted prices), creates a `pending` order, opens an
iKhokha paylink, and redirects the customer to it. iKhokha then confirms payment
two ways — both must be able to mark the order paid, since either can arrive
first or the other can be delayed:

- **`/api/ikhokha/webhook`** — server-to-server callback (primary).
- **`/checkout/success`** — the browser redirect back, which re-checks and
  marks the order paid as a fallback.

Both go through the same idempotent `markOrderPaidByReference()` in
`orders-db.ts`, guarded by `payment_status = "pending"` so a race between the
two can't double-process an order.

> **Local dev:** iKhokha needs a public URL to reach the webhook. Run an ngrok
> tunnel and point `NEXT_PUBLIC_SITE_URL` at it while testing locally.

### Address autocomplete (Google Places)

Checkout can verify delivery addresses via Google Places, so orders aren't
shipped to addresses that don't exist. It's **optional** — with no key set,
checkout falls back to plain manual entry and nothing breaks.

Setup:

1. Create a Google Cloud project and **enable billing**.
2. Enable **Places API (New)**.
3. Create an API key and **restrict it by HTTP referrer** to the store's
   domain. This key ships to the browser by necessity — an unrestricted key can
   be copied from page source and billed to the merchant.
4. Add it to `.env.local` / Vercel:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Implementation notes:

- Uses `PlaceAutocompleteElement` — the older `google.maps.places.Autocomplete`
  widget is deprecated. The element manages its own session tokens, which keeps
  usage in the free Autocomplete session tier.
- Results are restricted to South Africa (`includedRegionCodes: ["za"]`).
- **Only fields Google actually returns are locked.** If Google has no postal
  code for an address, that field stays editable rather than trapping the
  customer with an empty disabled input. There's also an "enter it manually"
  toggle for addresses Google doesn't know — important for townships, new
  developments and farm addresses.
- Unit/complex/building is a separate always-editable field
  (`shipping_address_line2`), since Google's formatted address never includes it.

## Design system

Tokens live in `tailwind.config.ts`: **Volt Blue `#0094FF`** primary, near-black
`#080810` ink, white paper, and the **A/B/C condition colours** (green/amber/grey).
Fonts: Space Grotesk (display) + Inter (body). The recurring sheared "/" motif comes
from the logo.
# slogan-studio
