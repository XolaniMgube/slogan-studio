"use client";

import { useEffect } from "react";
import { CatalogueUnavailable } from "@/components/catalogue-unavailable";

export default function ProductError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[product] render failed:", error);
  }, [error]);

  return (
    <div className="wrap py-16">
      <CatalogueUnavailable onRetry={reset} />
    </div>
  );
}
