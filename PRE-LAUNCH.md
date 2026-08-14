# Pre-launch checklist

Working document. Tick as you verify. Anything marked **⚠️ BLOCKER** must be done
before real customers can use the site.

---

## ⚠️ Config changes required before go-live

- [ ] **Revert the free-shipping override.** `FREE_SHIPPING_OVERRIDE = true` in
      `src/lib/shop-config.ts` makes *every* order ship free. Set it to `false`
      to restore the real rule (R150 under R1000, free at/above R1000).
      **Until this is flipped, every real customer gets free delivery.**
- [ ] **Set `NEXT_PUBLIC_SITE_URL` to the live domain** (currently
      `http://localhost:3000`). iKhokha builds its callback + redirect URLs from
      this — wrong value means payments never confirm.
- [ ] **Add production env vars to Vercel** (they only exist in `.env.local`):
      `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_DASHBOARD_PASSWORD`,
      `ADMIN_SESSION_SECRET`, `IKHOKHA_APP_ID`, `IKHOKHA_APP_SECRET`,
      `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SITE_URL`
- [ ] **Add the live domain to the Google Maps key** referrers
      (`https://sloganstudio.co.za/*` and `https://*.sloganstudio.co.za/*`)
- [ ] **Change `ADMIN_DASHBOARD_PASSWORD`** if the current one has been shared
- [ ] **Remove or hide the "Test Iphone" product** (R2, category Laptops)
- [ ] **Replace the demo customer reviews.** `src/lib/reviews.ts` contains six
      invented reviews written to demo the design — no real customer said any of
      them. Swap in genuine feedback (WhatsApp, Google reviews, email) before the
      site is promoted to anyone.
- [ ] Confirm all Supabase migrations have been run against production

---

## Already verified (don't need re-testing, but re-check after deploy)

| What | Verified | Evidence |
|---|---|---|
| iKhokha payment → paylink → real payment | 2026-07-31 | R2 paid, appeared in iK dashboard |
| Success-page fallback marks order paid | 2026-07-31 | Order `SS-MS981OO9` |
| Webhook marks order paid (tab closed) | 2026-08-01 | `SS-MSAEFFL1`, success page never loaded |
| Stock decrements on payment | 2026-08-01 | 5 → 4 → 3, exact match on qty |
| Address autocomplete → database | 2026-08-01 | Township address, province saved |
| API key properly restricted | 2026-08-01 | 403 without referrer, works with |
| Stock restores on cancel | 2026-08-01 | `SS-PRFMTAJAVC` 1 → 2 on cancel |
| Restore is idempotent | 2026-08-01 | cancelled → refunded, stock stayed 2 |
| Payment still settles after security fix | 2026-08-01 | `SS-PRFMTAJAVC`, token round-trip |

---

## Manual test checklist

### Payments
- [ ] Buy an item — redirects to iKhokha, payment completes, order appears in `/admin/orders`
- [ ] **Cancel** a payment on iKhokha's page → lands back on `/checkout?payment=cancelled`
      with a friendly message **and the cart still full** (not emptied)
- [ ] **Fail** a payment → lands on `/checkout?payment=failed`, cart intact
- [ ] Order total charged matches the cart total exactly (incl. shipping)
- [ ] Cart only empties after a *confirmed* payment, never before

### Shipping (after reverting the override)
- [ ] Cart under R1000 → shipping shows **R150**
- [ ] Cart at exactly R1000 → shipping shows **R0**
- [ ] Cart over R1000 → shipping shows **R0**
- [ ] Amount charged by iKhokha matches the displayed total in each case
- [ ] Shipping page, product cards and footer badge all describe the same rule

### Stock
- [ ] Buying decrements stock by exactly the quantity ordered
- [ ] Buying the last unit flips the product to **sold_out**
- [ ] Sold-out product can't be added to cart
- [ ] Cancelling an order **restores** stock (order must be created after the
      restore migration)
- [ ] Toggling cancelled → refunded → cancelled does **not** restore twice
- [ ] Two browsers buying the last unit simultaneously — only one succeeds

### Address autocomplete
- [ ] Suggestions appear while typing a street address
- [ ] Selecting one fills City / Province / Postal and locks them with ✓ verified
- [ ] "My address isn't listed" unlocks everything for manual entry
- [ ] Unit / Complex field stays editable and saves to the order
- [ ] Try a township / rural / new-development address — if Google can't complete
      it, the manual fallback must still allow checkout
- [ ] Widget renders light (not dark) — check on a machine set to dark mode

### Admin
- [ ] `/admin` redirects to login when logged out
- [ ] **Log out actually logs you out** — click Logout, then browse straight back
      to `/admin`; you must land on the login page *(fixed but never verified)*
- [ ] Wrong password is rejected
- [ ] Create, edit and image-upload all work on products
- [ ] Order status + payment status updates persist
- [ ] Session survives a page refresh

### Order tracking
- [ ] `/track` finds an order with the correct order number + email
- [ ] Wrong email for a valid order number is **rejected** (no data leak)
- [ ] Entering `%` as the email is **rejected** (was a wildcard bypass, fixed 2026-08-01)
- [ ] Non-existent order number gives a friendly error, not a crash
- [ ] Status timeline reflects the real order status
- [ ] Cancelled/refunded orders show the distinct message

### Security (re-test after deploy)
- [ ] Visiting `/checkout/success?ref=<a real pending order>` **without** a `t`
      token does **not** mark it paid (check server logs for the refusal)
- [ ] `POST /api/ikhokha/webhook?reference=<real ref>` with `{"status":"SUCCESS"}`
      and no `t` token does **not** mark it paid
- [ ] A completed real payment still confirms correctly via both paths
- [ ] Editing prices in devtools / replaying the checkout request with a lower
      price still charges the correct amount (server re-prices from the DB)
- [ ] Order numbers look random (`SS-` + 10 chars), not sequential
- [ ] `/admin` and all admin actions reject an unauthenticated request

### General
- [ ] Mobile layout works — checkout, cart drawer, admin
- [ ] All nav links resolve (header, footer, mobile menu)
- [ ] 404 page works
- [ ] Product images load (including uploaded ones, not just placeholders)
- [ ] No console errors on the main flows

---

## Outstanding security work (not blocking, but do it)

- [ ] **Rate limiting.** There is none. Low priority for `/admin/login` while the
      password stays long and random (brute force is infeasible either way), but
      `/api/ikhokha/initialize` can be spammed to create junk orders and paylinks.
      On Vercel this needs a shared store (Upstash Redis or similar) — in-memory
      counters don't work across serverless instances.
- [ ] **Use a different admin password in production** than the local one, which
      has appeared in screenshots during development.
- [ ] **Image upload trusts the client-supplied MIME type.** `product-images.ts`
      checks `file.type`, which the client controls. Admin-only, so low risk, but
      magic-byte sniffing would be stronger.
- [ ] **No audit log** of admin actions (who changed a price / order status).

### Fixed 2026-08-01

- **Forged payment confirmation (critical).** Both `/checkout/success` and the
  webhook marked orders paid using only the order reference — which is returned
  to the browser at checkout. Anyone could start an order, skip payment, and hit
  either endpoint to have it marked paid and shipped. Both now require an
  HMAC token embedded in the URLs we hand to iKhokha.
- **Order-tracking email bypass (high).** The email was matched with SQL `ilike`,
  so `%` acted as a wildcard and matched any email for a given order number.
  Now compared in application code.
- **Predictable order numbers (medium).** Were `Date.now()` in base36 —
  enumerable. Now 10 random characters from a ~2^50 keyspace.

---

## Known limitations (accepted, not bugs)

- **Un-cancelling doesn't re-decrement stock.** Cancel restores stock; setting the
  order back to paid does not remove it again. Adjust manually.
- **Partial stock shortfalls don't auto-restore.** If an order was paid but stock
  was short, it's flagged in logs for manual handling and won't restore on cancel.
- **Orders paid before the restore migration** have `stock_decremented = false`
  and won't restore on cancel.
- **iKhokha has no sandbox.** Every test is a real transaction.
- **`generateStaticParams`** builds from the static seed list, so products that
  exist only in the database render on demand rather than being prerendered.
