import { requireAdmin } from "@/lib/admin-auth";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { AdminNav } from "../../admin-nav";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <AdminNav />
      <main className="wrap max-w-[980px] py-10">
        <h1 className="font-display text-3xl font-bold tracking-[-0.5px]">Add product</h1>
        <p className="mb-8 mt-2 text-muted">Create a product for the storefront catalogue.</p>
        <ProductForm disabled={!isSupabaseAdminConfigured()} />
      </main>
    </>
  );
}
