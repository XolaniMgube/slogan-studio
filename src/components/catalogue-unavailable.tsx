"use client";

import Link from "next/link";

/**
 * Shown when the product catalogue genuinely can't be loaded.
 *
 * The storefront used to fall back to a hardcoded mock catalogue on failure,
 * which meant customers saw products that don't exist and could add them to a
 * cart. This is the honest alternative — and it keeps a route to a sale by
 * putting the WhatsApp number in front of the customer rather than a dead end.
 */
export function CatalogueUnavailable({ compact = false, onRetry }: { compact?: boolean; onRetry?: () => void }) {
  return (
    <div className={`grid place-items-center rounded-lg border border-dashed border-hairline bg-paper-2 text-center ${compact ? "py-12" : "py-20"}`}>
      <h2 className="font-display text-xl font-bold">We can&apos;t load our products right now</h2>
      <p className="mt-2 max-w-md px-6 text-[15px] text-muted">
        This is a temporary problem on our side, not with your connection. Please try again in a few minutes — or message us and
        we&apos;ll help you order directly.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary">
            Try again
          </button>
        )}
        <a href="https://wa.me/27739098254" className={onRetry ? "btn btn-ghost" : "btn btn-primary"}>
          WhatsApp 073 909 8254
        </a>
        <Link href="/" className="btn btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
