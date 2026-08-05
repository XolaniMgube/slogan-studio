import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/products-db";
import { formatRand } from "@/lib/utils";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { AdminPageHeader } from "../admin-shell";

export default async function AdminProductsPage() {
  await requireAdmin();
  const configured = isSupabaseAdminConfigured();
  const products = configured ? await getAdminProducts() : [];

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Manage catalogue visibility, stock and pricing."
        action={
          <Link href="/admin/products/new" className="btn btn-primary">
            Add product
          </Link>
        }
      />
      <div className="px-6 py-8 lg:px-9">
        {!configured && (
          <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase admin credentials are missing. Product edits are disabled until env vars are configured.
          </p>
        )}

        <div className="overflow-hidden rounded-lg border border-hairline bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-paper-2 font-display text-xs uppercase tracking-[1px] text-muted">
              <tr>
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
              {products.map((product) => (
                <tr key={product.id}>
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
                  <td className="px-4 py-4 text-right">
                    <Link href={`/admin/products/${product.id}/edit`} className="font-display text-sm font-semibold text-volt hover:text-ink">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td className="px-4 py-12 text-center text-muted" colSpan={7}>
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
