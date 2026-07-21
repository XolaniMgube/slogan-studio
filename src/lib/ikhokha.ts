import "server-only";

import { createHmac } from "crypto";

/**
 * IKHOKHA PAYMENT MODULE (server-only)
 * -------------------------------------
 * All payment logic lives behind this one file. The rest of the app only ever
 * calls `createPaylink()` — it never talks to iKhokha directly.
 *
 * iKhokha's iK Pay API is a Pay-by-Link model: you POST an amount (in cents)
 * + redirect/callback URLs, signed with an HMAC-SHA256 header, and get back a
 * `paylinkUrl` to send the customer to. iKhokha then redirects the customer
 * to your success/failure/cancel URL and (separately, server-to-server)
 * calls your webhook to confirm payment — see /api/ikhokha/webhook.
 *
 * Unlike the old Yoco module, there is no mock mode here: if
 * IKHOKHA_APP_ID / IKHOKHA_APP_SECRET aren't set, callers should surface a
 * clear "payments not configured" error rather than fake a success redirect.
 */

const IKHOKHA_APP_ID = process.env.IKHOKHA_APP_ID;
const IKHOKHA_APP_SECRET = process.env.IKHOKHA_APP_SECRET;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const IKHOKHA_API_PATH = "/public-api/v1/api/payment";
const IKHOKHA_ENDPOINT = `https://api.ikhokha.com${IKHOKHA_API_PATH}`;

export interface CreatePaylinkInput {
  amount: number; // total in rands, shipping included
  reference: string; // our order number — used as externalTransactionID and in the callback/redirect URLs
}

export interface PaylinkResult {
  redirectUrl: string;
  checkoutId: string;
}

export function isIkhokhaConfigured(): boolean {
  return Boolean(IKHOKHA_APP_ID?.trim() && IKHOKHA_APP_SECRET?.trim());
}

const NUL_BYTE = String.fromCharCode(0);

/** Matches iKhokha's own Go/Node examples byte-for-byte — do not "simplify" to JSON.stringify escaping. */
function jsonEscape(payload: string) {
  return payload.replace(/[\\"']/g, "\\$&").split(NUL_BYTE).join("\\0");
}

function sign(rawBody: string) {
  if (!IKHOKHA_APP_SECRET) throw new Error("Missing IKHOKHA_APP_SECRET.");
  const payloadToSign = jsonEscape(IKHOKHA_API_PATH + rawBody);
  return createHmac("sha256", IKHOKHA_APP_SECRET).update(payloadToSign).digest("hex");
}

export async function createPaylink(input: CreatePaylinkInput): Promise<PaylinkResult> {
  if (!isIkhokhaConfigured()) {
    throw new Error("iKhokha is not configured (missing IKHOKHA_APP_ID / IKHOKHA_APP_SECRET).");
  }

  const amountCents = Math.round(input.amount * 100);

  const requestBody = {
    entityID: IKHOKHA_APP_ID,
    externalEntityID: IKHOKHA_APP_ID,
    amount: amountCents,
    currency: "ZAR",
    requesterUrl: SITE_URL,
    mode: "live",
    externalTransactionID: input.reference,
    urls: {
      callbackUrl: `${SITE_URL}/api/ikhokha/webhook?reference=${encodeURIComponent(input.reference)}`,
      successPageUrl: `${SITE_URL}/checkout/success?ref=${encodeURIComponent(input.reference)}`,
      failurePageUrl: `${SITE_URL}/checkout?payment=failed`,
      cancelUrl: `${SITE_URL}/checkout?payment=cancelled`,
    },
  };

  // Sign the exact same string we send — never re-serialize before/after signing.
  const rawBody = JSON.stringify(requestBody);
  const signature = sign(rawBody);

  const res = await fetch(IKHOKHA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "IK-APPID": IKHOKHA_APP_ID as string,
      "IK-SIGN": signature,
    },
    body: rawBody,
  });

  const raw = await res.text();
  let data: { responseCode?: string; message?: string; paylinkUrl?: string; paylinkID?: string } = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // fall through — data stays {} and the checks below surface `raw` in the error
  }

  if (!res.ok || !data.paylinkUrl) {
    throw new Error(`iKhokha paylink failed (${res.status}): ${data.message ?? raw}`);
  }

  return { redirectUrl: data.paylinkUrl, checkoutId: data.paylinkID ?? input.reference };
}
