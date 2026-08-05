import Link from "next/link";
import { CheckIcon, ArrowIcon } from "@/components/icons";
import { markOrderPaidByReference } from "@/lib/orders-db";
import { verifyConfirmationToken } from "@/lib/ikhokha";
import { ClearCartOnSuccess } from "../clear-cart";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string; t?: string }> }) {
  const { ref, t } = await searchParams;

  // Fallback in case iKhokha's webhook hasn't landed yet by the time the
  // customer is redirected back.
  //
  // The token is mandatory. The order reference is handed to the browser when
  // checkout starts, so without this anyone could visit this page with their own
  // unpaid reference and have it marked paid. Only iKhokha's redirect carries a
  // valid token, and it only redirects after payment actually succeeds.
  if (ref) {
    if (verifyConfirmationToken(ref, t)) {
      try {
        await markOrderPaidByReference(ref);
      } catch (err) {
        console.error("Failed to confirm payment on success page:", err instanceof Error ? err.message : err);
      }
    } else {
      // Not fatal for the customer — the webhook is the primary path and will
      // settle the order regardless. We just refuse to settle it from here.
      console.error(`[checkout/success] Refusing to settle ${ref}: missing or invalid confirmation token.`);
    }
  }

  return (
    <div className="wrap grid place-items-center py-24 text-center">
      <ClearCartOnSuccess />
      <div className="grid h-20 w-20 place-items-center rounded-full bg-grade-a/10">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-grade-a">
          <CheckIcon className="h-7 w-7 stroke-white" />
        </div>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-[-0.5px]">Order confirmed</h1>
      <p className="mt-3 max-w-md text-muted">
        Thanks for your order! We&apos;ve received it and will be in touch shortly to arrange delivery.
        {ref && (
          <>
            {" "}
            Your reference is <strong className="text-ink">{ref}</strong>.
          </>
        )}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">
          <span>Continue shopping</span>
          <ArrowIcon className="h-4 w-4 stroke-white" />
        </Link>
        <Link href="/track" className="btn btn-ghost">
          Track your order
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
