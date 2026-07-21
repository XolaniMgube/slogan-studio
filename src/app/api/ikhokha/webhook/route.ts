import { NextRequest, NextResponse } from "next/server";
import { markOrderPaidByReference } from "@/lib/orders-db";

/**
 * Server-to-server callback iKhokha calls after a payment attempt. This has
 * no real payload signature verification (matching iKhokha's own reference
 * implementation) — only a soft IK-APPID header check. If this store handles
 * meaningful transaction volume, consider hardening this further (e.g. an
 * independent iKhokha payment-status lookup) rather than trusting the body.
 */
interface IkhokhaWebhookBody {
  status?: string;
  responseCode?: string;
  externalTransactionID?: string;
}

export async function POST(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  try {
    if (!reference) {
      console.error("iKhokha webhook called without a reference.");
    } else {
      const appId = process.env.IKHOKHA_APP_ID;
      const headerAppId = req.headers.get("IK-APPID");
      if (appId && headerAppId && headerAppId !== appId) {
        console.error(`iKhokha webhook IK-APPID mismatch for reference ${reference}.`);
      }

      const body = (await req.json()) as IkhokhaWebhookBody;

      // responseCode can read "00" even on a failed payment — status is the field to trust.
      const paid = body.status === "SUCCESS" || body.status === "COMPLETE";
      if (paid) await markOrderPaidByReference(reference);
    }
  } catch (err) {
    console.error("iKhokha webhook processing failed:", err instanceof Error ? err.message : err);
  }

  // Always ack 200 so iKhokha doesn't retry indefinitely.
  return NextResponse.json({ received: true });
}
