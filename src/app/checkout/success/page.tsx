import Link from "next/link";
import { CheckIcon, ArrowIcon } from "@/components/icons";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string; mock?: string }> }) {
  const { ref, mock } = await searchParams;

  return (
    <div className="wrap grid place-items-center py-24 text-center">
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

      {mock === "1" && (
        <p className="mt-4 max-w-md border border-mist-line bg-mist px-4 py-3 text-sm text-volt-deep">
          Demo mode: no real payment was taken. Add the Yoco keys to enable live payments.
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">
          <span>Continue shopping</span>
          <ArrowIcon className="h-4 w-4 stroke-white" />
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
