import { requireAdmin } from "@/lib/admin-auth";
import { OrderStatus, PaymentStatus } from "@/lib/database.types";
import { getAdminOrders } from "@/lib/orders-db";
import { isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { formatRand } from "@/lib/utils";
import { AdminNav } from "../admin-nav";
import { updateOrderStatusAction } from "../actions";

const orderStatuses: OrderStatus[] = ["pending_payment", "paid", "processing", "ready_to_ship", "shipped", "delivered", "cancelled", "refunded"];
const paymentStatuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAdminOrders();
  const configured = isSupabaseAdminConfigured();

  return (
    <>
      <AdminNav />
      <main className="wrap py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-[-0.5px]">Orders</h1>
          <p className="mt-2 text-muted">View customer orders and update payment or fulfilment status.</p>
        </div>

        {!configured && (
          <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase admin credentials are missing. Orders will appear here after Supabase is configured.
          </p>
        )}

        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-hairline bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-bold">{order.order_number}</p>
                  <p className="mt-1 text-sm text-muted">
                    {order.customer_name} · {order.customer_email} · {order.customer_phone}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {order.shipping_address_line1}, {order.shipping_city}, {order.shipping_postal_code}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold">{formatRand(order.total_cents / 100)}</p>
                  <p className="text-xs text-muted">{new Date(order.placed_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-md border border-hairline">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-hairline">
                    {order.order_items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 font-medium">{item.product_name}</td>
                        <td className="px-3 py-2 text-muted">Qty {item.quantity}</td>
                        <td className="px-3 py-2 text-right font-semibold">{formatRand(item.line_total_cents / 100)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form action={updateOrderStatusAction} className="mt-5 flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={order.id} />
                <label className="grid gap-1.5">
                  <span className="font-display text-xs font-semibold uppercase tracking-[1px] text-muted">Order status</span>
                  <select name="status" defaultValue={order.status} disabled={!configured} className="input min-w-[180px]">
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="font-display text-xs font-semibold uppercase tracking-[1px] text-muted">Payment</span>
                  <select name="paymentStatus" defaultValue={order.payment_status} disabled={!configured} className="input min-w-[150px]">
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button disabled={!configured} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50">
                  Update order
                </button>
              </form>
            </article>
          ))}

          {!orders.length && (
            <div className="rounded-lg border border-dashed border-hairline bg-white py-16 text-center">
              <p className="font-display text-lg font-semibold">No orders yet</p>
              <p className="mt-1 text-sm text-muted">Orders will appear after checkout records are created.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
