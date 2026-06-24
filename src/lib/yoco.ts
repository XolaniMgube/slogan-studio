import "server-only";

/**
 * YOCO PAYMENT MODULE (server-only)
 * ---------------------------------
 * All payment logic lives behind this one file. The rest of the app only ever
 * calls `createCheckout()` — it never touches Yoco directly.
 *
 * Yoco's hosted Checkout API: you POST an amount (in cents) + redirect URLs and
 * get back a `redirectUrl` to send the customer to. Yoco then redirects them to
 * your success/cancel URL and (separately) fires a webhook to confirm payment.
 *
 * Until the client's Yoco merchant account is live and YOCO_SECRET_KEY is set,
 * this runs in MOCK mode: it returns a fake success URL so the whole flow is
 * testable end-to-end without real money. Flip to real by adding the key.
 */

const YOCO_SECRET = process.env.YOCO_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const YOCO_CHECKOUT_ENDPOINT = "https://payments.yoco.com/api/checkouts";

export interface CheckoutLineItem {
  name: string;
  qty: number;
  price: number; // rands
}

export interface CreateCheckoutInput {
  items: CheckoutLineItem[];
  amount: number; // total in rands, VAT + shipping included
  reference: string;
  customerEmail?: string;
}

export interface CheckoutResult {
  redirectUrl: string;
  checkoutId: string;
  mock: boolean;
}

export function isLive(): boolean {
  return Boolean(YOCO_SECRET);
}

export async function createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
  const amountCents = Math.round(input.amount * 100);

  // ---- MOCK MODE: no real key yet ----
  if (!YOCO_SECRET) {
    return {
      redirectUrl: `${SITE_URL}/checkout/success?ref=${encodeURIComponent(input.reference)}&mock=1`,
      checkoutId: `mock_${input.reference}`,
      mock: true,
    };
  }

  // ---- LIVE MODE ----
  const res = await fetch(YOCO_CHECKOUT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${YOCO_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountCents,
      currency: "ZAR",
      successUrl: `${SITE_URL}/checkout/success?ref=${encodeURIComponent(input.reference)}`,
      cancelUrl: `${SITE_URL}/checkout?cancelled=1`,
      failureUrl: `${SITE_URL}/checkout?failed=1`,
      metadata: { reference: input.reference, email: input.customerEmail ?? "" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Yoco checkout failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { id: string; redirectUrl: string };
  return { redirectUrl: data.redirectUrl, checkoutId: data.id, mock: false };
}
