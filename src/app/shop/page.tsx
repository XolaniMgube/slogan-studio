import { Suspense } from "react";
import { getStoreProducts } from "@/lib/products-db";
import { ShopClient } from "./shop-client";

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <Suspense fallback={<div className="wrap py-24 text-center text-muted">Loading products...</div>}>
      <ShopClient products={products} />
    </Suspense>
  );
}
