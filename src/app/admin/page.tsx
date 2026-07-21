import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOrders } from "@/lib/orders-db";
import { getAdminProducts } from "@/lib/products-db";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { AdminNav } from "./admin-nav";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [products, orders] = await Promise.all([getAdminProducts(), getAdminOrders()]);
  const active = products.filter((product) => product.status === "active").length;
  const lowStock = products.filter((product) => product.stock <= product.lowStockThreshold).length;
  const openOrders = orders.filter((order) => !["delivered", "cancelled", "refunded"].includes(order.status)).length;

  return (
    <>
      <AdminNav />
      <main className="wrap py-10">
        {!isSupabaseAdminConfigured() && <SetupNotice />}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-[-0.5px]">Dashboard</h1>
            <p className="mt-2 text-muted">A quick view of stock and order activity.</p>
          </div>
          <Link href="/admin/products/new" className="btn btn-primary">
            Add product
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Active products" value={active} />
          <Metric label="Low / no stock" value={lowStock} />
          <Metric label="Open orders" value={openOrders} />
        </div>
      </main>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-hairline bg-white p-6">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold">{value}</p>
    </div>
  );
}

function SetupNotice() {
  return (
    <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Supabase admin credentials are not configured yet. The dashboard is showing fallback data and write actions will be disabled until env vars are added.
    </p>
  );
}
