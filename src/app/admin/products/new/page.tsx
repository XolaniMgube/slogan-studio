import { requireAdmin } from "@/lib/admin-auth";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { AdminPageHeader } from "../../admin-shell";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <AdminPageHeader title="Add product" description="Create a product for the storefront catalogue." />
      <div className="max-w-[980px] px-6 py-8 lg:px-9">
        <ProductForm disabled={!isSupabaseAdminConfigured()} />
      </div>
    </>
  );
}
