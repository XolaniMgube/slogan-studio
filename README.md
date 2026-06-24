# Slogan Studio — E-commerce

Refurbished electronics store built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v3**, **Zustand**, and a **Yoco** payment integration.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # optional until Yoco keys exist
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
| `/checkout` | Delivery form + order summary → Yoco |
| `/checkout/success` | Order confirmation |
| `/services`, `/about`, `/warranty`, `/shipping`, `/account` | Info pages |
| `/api/checkout` | Server route that creates the Yoco checkout |

## Architecture

```
src/
  app/            routes (App Router)
  components/     UI — header, footer, hero, product card, cart drawer, sections…
  lib/
    types.ts      domain types (Product, Grade…)
    products.ts   ⭐ MOCK DATA — single source of truth (swap-later)
    cart-store.ts Zustand cart, persisted to localStorage
    yoco.ts       ⭐ payment module — the ONLY file that talks to Yoco
    utils.ts      price formatting, helpers
```

### The data layer (swap-later)

All product data lives in **`src/lib/products.ts`**. Every component reads through the
helper functions (`getFeatured`, `getByCategory`, `getBySlug`…) — nothing hard-codes
products. When the real backend/admin is ready, replace the `PRODUCTS` array (or make
the helpers `async` and fetch) and the rest of the app is untouched.

Product images are currently SVG placeholders in `public/products/`. Drop real device
photos in and update the `images` paths in `products.ts`.

### Payments (Yoco)

All payment logic is isolated in **`src/lib/yoco.ts`**. The app only calls
`createCheckout()` — it never touches Yoco directly.

**Until the client's Yoco merchant account is live**, it runs in **mock mode**: the
checkout flow works end-to-end and redirects to the success page, but no real money
moves. To go live, add the keys to `.env.local`:

```
YOCO_SECRET_KEY=sk_live_xxxx
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_live_xxxx
NEXT_PUBLIC_SITE_URL=https://sloganstudio.co.za
```

The module auto-switches to live mode when `YOCO_SECRET_KEY` is set.

> **Note:** full payment testing needs the client's Yoco credentials. A production
> setup should also add a **webhook** route to confirm payment before fulfilling an
> order — that's the next step once the merchant account exists.

## Design system

Tokens live in `tailwind.config.ts`: **Volt Blue `#0094FF`** primary, near-black
`#080810` ink, white paper, and the **A/B/C condition colours** (green/amber/grey).
Fonts: Space Grotesk (display) + Inter (body). The recurring sheared "/" motif comes
from the logo.
# slogan-studio
