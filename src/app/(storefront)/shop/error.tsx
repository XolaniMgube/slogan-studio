"use client";

import { useEffect } from "react";
import { CatalogueUnavailable } from "@/components/catalogue-unavailable";

/**
 * Rendered when the shop page throws — i.e. the catalogue genuinely couldn't be
 * loaded and there's no cached page to fall back on.
 *
 * This lives in an error boundary rather than a try/catch inside the page on
 * purpose: a caught error renders "successfully" and would get cached by ISR,
 * pinning the failure state in place after the database recovered. Throwing lets
 * Next keep serving the last good page and retry quietly in the background.
 */
export default function ShopError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[shop] render failed:", error);
  }, [error]);

  return (
    <div className="wrap py-16">
      <CatalogueUnavailable onRetry={reset} />
    </div>
  );
}
