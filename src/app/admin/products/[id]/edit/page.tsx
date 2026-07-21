import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProduct } from "@/lib/products-db";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { AdminNav } from "../../../admin-nav";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();

  return (
    <>
      <AdminNav />
      <main className="wrap max-w-[980px] py-10">
        <h1 className="font-display text-3xl font-bold tracking-[-0.5px]">Edit product</h1>
        <p className="mb-8 mt-2 text-muted">{product.name}</p>
        <ProductForm product={product} disabled={!isSupabaseAdminConfigured()} />
      </main>
    </>
  );
}
