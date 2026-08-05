import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOrders } from "@/lib/orders-db";
import { getAdminProducts } from "@/lib/products-db";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { formatRand } from "@/lib/utils";
import { AdminPageHeader } from "./admin-shell";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const configured = isSupabaseAdminConfigured();
  const [products, orders] = configured ? await Promise.all([getAdminProducts(), getAdminOrders()]) : [[], []];

  const active = products.filter((product) => product.status === "active").length;
  const lowStock = products.filter((product) => product.stock <= product.lowStockThreshold).length;
  const openOrders = orders.filter((order) => !["delivered", "cancelled", "refunded"].includes(order.status)).length;
  const paidRevenue = orders
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + order.total_cents, 0);

  const recent = orders.slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="A quick view of stock and order activity."
        action={
          <Link href="/admin/products/new" className="btn btn-primary">
            Add product
          </Link>
        }
      />

      <div className="px-6 py-8 lg:px-9">
        {!configured && <SetupNotice />}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Active products" value={String(active)} />
          <Metric label="Low / no stock" value={String(lowStock)} tone={lowStock > 0 ? "warn" : undefined} />
          <Metric label="Open orders" value={String(openOrders)} />
          <Metric label="Revenue (paid)" value={formatRand(paidRevenue / 100)} />
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-hairline bg-white">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <h2 className="font-display text-base font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="font-display text-sm font-semibold text-volt hover:text-ink">
              View all
            </Link>
          </div>

          {recent.length ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-paper-2 font-display text-xs uppercase tracking-[1px] text-muted">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-3.5 font-display font-semibold">{order.order_number}</td>
                    <td className="px-5 py-3.5 text-muted">{order.customer_name}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold">{formatRand(order.total_cents / 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-muted">No orders yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  return (
    <div className="rounded-lg border border-hairline bg-white p-5">
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${tone === "warn" ? "text-grade-b" : ""}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "paid" || status === "delivered"
      ? "bg-grade-a/10 text-grade-a"
      : status === "cancelled" || status === "refunded"
        ? "bg-red-50 text-red-600"
        : "bg-mist text-volt-deep";

  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

function SetupNotice() {
  return (
    <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Supabase admin credentials are not configured yet. Product and order data won&apos;t load until the env vars are added.
    </p>
  );
}
