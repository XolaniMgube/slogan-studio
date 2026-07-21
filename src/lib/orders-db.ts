import "server-only";

import { calculateShipping } from "./shop-config";
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

export function createOrderNumber() {
  return `SS-${Date.now().toString(36).toUpperCase()}`;
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

  if (itemsError) throw new Error(itemsError.message);

  return {
    id: order.id,
    orderNumber: input.paymentReference,
    subtotal,
    shipping,
    total,
    persisted: true,
  };
}

/**
 * Marks an order paid by its payment reference. Guarded by payment_status =
 * "pending" so it's safe to call from both the iKhokha webhook and the
 * checkout success-page fallback without double-processing a race between
 * the two.
 */
export async function markOrderPaidByReference(reference: string): Promise<{ updated: boolean }> {
  if (!isSupabaseAdminConfigured()) return { updated: false };

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "paid", payment_status: "paid", paid_at: now })
    .eq("payment_reference", reference)
    .eq("payment_status", "pending")
    .select("id");

  if (error) throw new Error(error.message);
  return { updated: Boolean(data?.length) };
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
 */
export async function getOrderForTracking(orderNumber: string, email: string): Promise<TrackedOrder | null> {
  if (!isSupabaseAdminConfigured()) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("order_number, status, payment_status, placed_at, paid_at, fulfilled_at, shipping_city")
    .eq("order_number", orderNumber.trim().toUpperCase())
    .ilike("customer_email", email.trim())
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
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
