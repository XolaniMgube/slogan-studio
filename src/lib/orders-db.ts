import "server-only";

import { randomBytes } from "crypto";
import { calculateShipping } from "./shop-config";
import { orderNumberCandidates } from "./validation";
import { OrderRow, OrderStatus, PaymentStatus, ProductGrade } from "./database.types";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "./supabase/server";

interface OrderCartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  grade: ProductGrade;
  image: string;
  qty: number;
}

export type AdminOrder = OrderRow & {
  order_items: {
    id: string;
    product_name: string;
    product_slug: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
    grade: ProductGrade | null;
  }[];
};

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  province?: string;
  postal: string;
}

/** Unambiguous characters only — customers read these off a screen and type them into /track. */
const ORDER_NUMBER_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Order numbers must be unguessable, not just unique: they're half of the
 * authorization for customer order tracking, and they're handed to the browser
 * at checkout. The previous `Date.now().toString(36)` was a plain timestamp —
 * trivially enumerable, so anyone could walk the sequence and probe orders.
 *
 * No separator: customers retype these into /track, and a dash is one more thing
 * to get wrong. Lookups normalise input anyway, so old dashed numbers still work.
 */
export function createOrderNumber() {
  const bytes = randomBytes(10);
  let out = "";
  for (const byte of bytes) out += ORDER_NUMBER_ALPHABET[byte % ORDER_NUMBER_ALPHABET.length];
  return `SS${out}`;
}

export async function createPendingOrder(input: {
  customer: CheckoutCustomer;
  items: OrderCartItem[];
  ikhokhaCheckoutId?: string;
  paymentReference: string;
  paymentStatus?: PaymentStatus;
}) {
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  if (!isSupabaseAdminConfigured()) {
    return {
      id: input.paymentReference,
      orderNumber: input.paymentReference,
      subtotal,
      shipping,
      total,
      persisted: false,
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: input.paymentReference,
      status: input.paymentStatus === "paid" ? "paid" : "pending_payment",
      payment_status: input.paymentStatus ?? "pending",
      customer_name: input.customer.name,
      customer_email: input.customer.email,
      customer_phone: input.customer.phone,
      shipping_address_line1: input.customer.address,
      shipping_address_line2: input.customer.address2 ?? null,
      shipping_city: input.customer.city,
      shipping_province: input.customer.province ?? null,
      shipping_postal_code: input.customer.postal,
      shipping_country: "South Africa",
      subtotal_cents: subtotal * 100,
      shipping_cents: shipping * 100,
      discount_cents: 0,
      total_cents: total * 100,
      ikhokha_checkout_id: input.ikhokhaCheckoutId ?? null,
      payment_reference: input.paymentReference,
      notes: null,
      paid_at: input.paymentStatus === "paid" ? new Date().toISOString() : null,
      fulfilled_at: null,
    })
    .select("id")
    .single();

  if (orderError) throw new Error(orderError.message);

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: isUuid(item.id) ? item.id : null,
      product_slug: item.slug,
      product_name: item.name,
      product_sku: null,
      grade: item.grade,
      quantity: item.qty,
      unit_price_cents: item.price * 100,
      line_total_cents: item.price * item.qty * 100,
      image: item.image,
    }))
  );

  if (itemsError) {
    // Compensating delete. The orders row is already committed at this point, so
    // without this we'd leave a pending order with zero line items — and
    // mark_order_paid() iterates order_items to decrement stock, so such an order
    // would later be marked paid while moving no inventory at all. order_items
    // cascades from orders, so removing the parent is enough.
    const { error: rollbackError } = await supabase.from("orders").delete().eq("id", order.id);
    if (rollbackError) {
      console.error(
        `[ORDER] Could not roll back order ${order.id} (${input.paymentReference}) after its line items failed to save: ` +
          `${rollbackError.message}. This order has no items and must not be fulfilled — resolve it manually.`
      );
    }
    throw new Error(itemsError.message);
  }

  return {
    id: order.id,
    orderNumber: input.paymentReference,
    subtotal,
    shipping,
    total,
    persisted: true,
  };
}

export interface StockShortfall {
  productId: string;
  name: string;
  wanted: number;
}

interface MarkOrderPaidResult {
  found: boolean;
  updated: boolean;
  orderId?: string;
  shortfalls: StockShortfall[];
}

/**
 * Marks an order paid and decrements stock atomically, via the `mark_order_paid`
 * Postgres function (see supabase/migrations/20260731000000_stock_decrement.sql).
 *
 * Safe to call from both the iKhokha webhook and the checkout success-page
 * fallback — the function locks the order row and only acts while
 * payment_status is still "pending", so whichever arrives second is a no-op.
 *
 * `shortfalls` is non-empty when the customer paid for stock we no longer had.
 * The order is still marked paid (their money was taken) — it needs manual
 * resolution, so it's logged loudly here.
 */
export async function markOrderPaidByReference(reference: string): Promise<{ updated: boolean; shortfalls: StockShortfall[] }> {
  if (!isSupabaseAdminConfigured()) return { updated: false, shortfalls: [] };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("mark_order_paid", { p_reference: reference });

  if (error) throw new Error(error.message);

  const result = (data ?? { found: false, updated: false, shortfalls: [] }) as MarkOrderPaidResult;
  const shortfalls = result.shortfalls ?? [];

  if (shortfalls.length) {
    console.error(
      `[STOCK] Order ${reference} was paid but stock was insufficient for: ` +
        shortfalls.map((s) => `${s.name} (wanted ${s.wanted})`).join(", ") +
        " — needs manual resolution (refund or source another unit)."
    );
  }

  return { updated: result.updated, shortfalls };
}

export interface RestoredStockItem {
  productId: string;
  name: string;
  quantity: number;
}

/**
 * Puts an order's stock back when it's cancelled or refunded, via the
 * `restore_order_stock` Postgres function.
 *
 * Only acts on orders whose stock was cleanly decremented in the first place
 * (tracked by orders.stock_decremented), and clears that flag on the way out —
 * so repeated cancel/refund edits in the back office can't inflate inventory.
 */
export async function restoreOrderStock(orderId: string): Promise<{ restored: boolean; items: RestoredStockItem[] }> {
  if (!isSupabaseAdminConfigured()) return { restored: false, items: [] };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("restore_order_stock", { p_order_id: orderId });

  if (error) throw new Error(error.message);

  const result = (data ?? { restored: false, items: [] }) as { restored: boolean; items?: RestoredStockItem[] };
  const items = result.items ?? [];

  if (result.restored && items.length) {
    console.log(`[STOCK] Restored for order ${orderId}: ` + items.map((i) => `${i.name} ×${i.quantity}`).join(", "));
  }

  return { restored: result.restored, items };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export interface TrackedOrder {
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  placed_at: string;
  paid_at: string | null;
  fulfilled_at: string | null;
  shipping_city: string;
}

/**
 * Customer-facing order lookup. Orders has no public RLS read policy (only the
 * service role can read it), so this runs through the admin client but
 * enforces its own authorization by requiring an exact order number + email
 * match — never look up an order by number alone.
 *
 * The email is compared in application code, NOT via a SQL `ilike`. `ilike`
 * treats `%` and `_` in the supplied value as wildcards, so an attacker could
 * pass `%` and match any email for a given order number — bypassing the check
 * entirely.
 */
export async function getOrderForTracking(orderNumber: string, email: string): Promise<TrackedOrder | null> {
  if (!isSupabaseAdminConfigured()) return null;

  // Accepts "ssabc123", "SS-ABC123", "ss abc 123" — and matches orders stored in
  // either the old dashed format or the current one.
  const candidates = orderNumberCandidates(orderNumber);
  if (!candidates.length) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("order_number, status, payment_status, placed_at, paid_at, fulfilled_at, shipping_city, customer_email")
    .in("order_number", candidates)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  if (data.customer_email.trim().toLowerCase() !== email.trim().toLowerCase()) return null;

  // Don't hand the stored email back to the caller — they had to know it already.
  const { customer_email: _email, ...tracked } = data;
  return tracked;
}

/**
 * Order states that still need action from the shop. Everything else —
 * delivered, cancelled, refunded — is finished business.
 */
export const UNRESOLVED_ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "ready_to_ship",
  "shipped",
];

/**
 * Product IDs that appear on an order still in flight.
 *
 * Deleting one of these would null its product_id on the order line, so the
 * stock decrement/restore functions would silently skip it — you'd be left
 * fulfilling an order for a product the system no longer knows about.
 */
export async function getProductIdsWithUnresolvedOrders(): Promise<Set<string>> {
  if (!isSupabaseAdminConfigured()) return new Set();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("order_items")
    .select("product_id, orders!inner(status)")
    .not("product_id", "is", null)
    .in("orders.status", UNRESOLVED_ORDER_STATUSES);

  if (error) throw new Error(error.message);

  return new Set((data ?? []).map((row) => row.product_id).filter((id): id is string => Boolean(id)));
}

/** Orders still in flight that include this product, for an explanatory message. */
export async function getUnresolvedOrdersForProduct(productId: string): Promise<{ order_number: string; status: OrderStatus }[]> {
  if (!isSupabaseAdminConfigured()) return [];

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("order_items")
    .select("orders!inner(order_number, status)")
    .eq("product_id", productId)
    .in("orders.status", UNRESOLVED_ORDER_STATUSES);

  if (error) throw new Error(error.message);

  const seen = new Map<string, { order_number: string; status: OrderStatus }>();
  for (const row of (data ?? []) as unknown as { orders: { order_number: string; status: OrderStatus } }[]) {
    if (row.orders) seen.set(row.orders.order_number, row.orders);
  }
  return [...seen.values()];
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseAdminConfigured()) return [];

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(id, product_name, product_slug, quantity, unit_price_cents, line_total_cents, grade)")
    .order("placed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as AdminOrder[];
}
