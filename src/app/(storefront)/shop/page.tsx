import { Suspense } from "react";
import { getStoreProducts } from "@/lib/products-db";
import { ShopClient } from "./shop-client";

/**
 * Re-render at most once a minute. Admin edits call revalidatePath("/shop"), so
 * changes still appear immediately — the window exists so a brief Supabase
 * outage serves the last good page instead of an error.
 *
 * Load failures are deliberately NOT caught here; they propagate to error.tsx.
 * See that file for why.
 */
export const revalidate = 60;

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <Suspense fallback={<div className="wrap py-24 text-center text-muted">Loading products...</div>}>
      <ShopClient products={products} />
    </Suspense>
  );
}
