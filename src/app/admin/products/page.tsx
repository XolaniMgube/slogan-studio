import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { MAX_PRODUCTS, getAdminProducts } from "@/lib/products-db";
import { getProductIdsWithUnresolvedOrders } from "@/lib/orders-db";
import { formatRand } from "@/lib/utils";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { AdminPageHeader } from "../admin-shell";
import { DeleteProductButton } from "./delete-product-button";

export default async function AdminProductsPage() {
  await requireAdmin();
  const configured = isSupabaseAdminConfigured();

  const [products, lockedProductIds] = configured
    ? await Promise.all([getAdminProducts(), getProductIdsWithUnresolvedOrders()])
    : [[], new Set<string>()];

  const atLimit = products.length >= MAX_PRODUCTS;

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`Manage catalogue visibility, stock and pricing. ${products.length} of ${MAX_PRODUCTS} products used.`}
        action={
          atLimit ? (
            <span className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800">
              Product limit reached
            </span>
          ) : (
            <Link href="/admin/products/new" className="btn btn-primary">
              Add product
            </Link>
          )
        }
      />
      <div className="px-6 py-8 lg:px-9">
        {atLimit && (
          <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You&apos;ve reached the {MAX_PRODUCTS}-product limit. Delete a product before adding another.
          </p>
        )}

        {!configured && (
          <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase admin credentials are missing. Product edits are disabled until env vars are configured.
          </p>
        )}

        <div className="overflow-hidden rounded-lg border border-hairline bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-paper-2 font-display text-xs uppercase tracking-[1px] text-muted">
              <tr>
                <th className="w-12 px-4 py-3 text-right">#</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {products.map((product, index) => (
                <tr key={product.id}>
                  {/* Position in the list, oldest product = 1. */}
                  <td className="px-4 py-4 text-right font-display text-sm font-semibold text-muted">{index + 1}</td>
                  <td className="px-4 py-4">
                    <p className="font-display font-semibold">{product.name}</p>
                    <p className="text-xs text-muted">{product.sku ?? product.slug}</p>
                  </td>
                  <td className="px-4 py-4">{product.category}</td>
                  <td className="px-4 py-4 capitalize">{product.status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-4">
                    <span className={product.stock <= product.lowStockThreshold ? "font-semibold text-grade-b" : ""}>{product.stock}</span>
                  </td>
                  <td className="px-4 py-4 font-semibold">{formatRand(product.price)}</td>
                  <td className="px-4 py-4">{product.featured ? "Yes" : "No"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <Link href={`/admin/products/${product.id}/edit`} className="font-display text-sm font-semibold text-volt hover:text-ink">
                      Edit
                    </Link>
                    <span className="mx-2.5 text-hairline-strong">|</span>
                    <DeleteProductButton
                      id={product.id}
                      name={product.name}
                      blockedReason={
                        lockedProductIds.has(product.id)
                          ? "This product is on an order that hasn't been delivered, cancelled or refunded yet. Finish that order first, or set the product to archived to hide it from the shop."
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td className="px-4 py-12 text-center text-muted" colSpan={8}>
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
