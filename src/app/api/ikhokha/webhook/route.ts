import { NextRequest, NextResponse } from "next/server";
import { markOrderPaidByReference } from "@/lib/orders-db";
import { verifyConfirmationToken } from "@/lib/ikhokha";

/**
 * Server-to-server callback iKhokha calls after a payment attempt.
 *
 * iKhokha does not sign its webhook payloads, so we can't verify the body. What
 * we CAN verify is the `t` token we embedded in the callback URL when creating
 * the paylink — only something that received that URL from us via iKhokha can
 * present it. Without that check this endpoint would let anyone mark any order
 * paid by POSTing {"status":"SUCCESS"} with a known reference.
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
    } else if (!verifyConfirmationToken(reference, req.nextUrl.searchParams.get("t"))) {
      // Forged or tampered callback — never settle an order off this.
      console.error(`[iKhokha webhook] REJECTED ${reference}: missing or invalid confirmation token.`);
    } else {
      const body = (await req.json()) as IkhokhaWebhookBody;

      // responseCode can read "00" even on a failed payment — status is the field to trust.
      const paid = body.status === "SUCCESS" || body.status === "COMPLETE";
      console.log(`[iKhokha webhook] ${reference} status=${body.status ?? "?"} responseCode=${body.responseCode ?? "?"} treatingAsPaid=${paid}`);

      if (paid) {
        const { updated } = await markOrderPaidByReference(reference);
        console.log(
          updated
            ? `[iKhokha webhook] ${reference} marked PAID by webhook (stock decremented).`
            : `[iKhokha webhook] ${reference} already settled — no-op (the success page got there first).`
        );
      }
    }
  } catch (err) {
    console.error("iKhokha webhook processing failed:", err instanceof Error ? err.message : err);
  }

  // Always ack 200 so iKhokha doesn't retry indefinitely.
  return NextResponse.json({ received: true });
}
