import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProduct } from "@/lib/products-db";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { AdminPageHeader } from "../../../admin-shell";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();

  return (
    <>
      <AdminPageHeader title="Edit product" description={product.name} />
      <div className="max-w-[980px] px-6 py-8 lg:px-9">
        <ProductForm product={product} disabled={!isSupabaseAdminConfigured()} />
      </div>
    </>
  );
}
