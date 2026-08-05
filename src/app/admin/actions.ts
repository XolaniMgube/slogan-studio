"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, requireAdmin, verifyPassword } from "@/lib/admin-auth";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { OrderStatus, PaymentStatus, ProductGrade, ProductStatus } from "@/lib/database.types";
import { restoreOrderStock } from "@/lib/orders-db";
import { getImageFiles, uploadProductImages } from "@/lib/product-images";

export async function loginAdmin(_: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) return { error: "Incorrect admin password." };

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveProductAction(formData: FormData) {
  // Must run before anything else — the image upload below writes to storage.
  await requireAdmin();
  if (!isSupabaseAdminConfigured()) throw new Error("Supabase admin credentials are not configured.");

  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const compareAtRaw = String(formData.get("compareAt") ?? "").trim();
  const shipping = Number(formData.get("shipping") ?? 150);
  const stock = Number(formData.get("stock") ?? 0);
  const existingImages = lines(formData.get("existingImages")).slice(0, 3);
  const uploadedImages = await uploadProductImages(getImageFiles(formData), slug);
  const images = uploadedImages.length ? uploadedImages : existingImages;

  const payload = {
    slug,
    sku: nullableText(formData.get("sku")),
    name,
    category,
    brand: nullableText(formData.get("brand")),
    model: nullableText(formData.get("model")),
    grade: String(formData.get("grade") ?? "A") as ProductGrade,
    status: String(formData.get("status") ?? "draft") as ProductStatus,
    price_cents: Math.round(price * 100),
    compare_at_cents: compareAtRaw ? Math.round(Number(compareAtRaw) * 100) : null,
    shipping_cents: Math.round(shipping * 100),
    stock_qty: Math.max(0, Math.round(stock)),
    low_stock_threshold: Math.max(0, Math.round(Number(formData.get("lowStockThreshold") ?? 1))),
    spec: String(formData.get("spec") ?? "").trim(),
    specs: lines(formData.get("specs")),
    description: String(formData.get("description") ?? "").trim(),
    condition_notes: nullableText(formData.get("conditionNotes")),
    warranty_months: Math.max(0, Math.round(Number(formData.get("warrantyMonths") ?? 3))),
    images,
    is_featured: formData.get("isFeatured") === "on",
    is_visible: formData.get("isVisible") === "on",
  };

  const supabase = createSupabaseAdminClient();
  const { error } = id
    ? await supabase.from("products").update(payload).eq("id", id)
    : await supabase.from("products").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseAdminConfigured()) throw new Error("Supabase admin credentials are not configured.");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending_payment") as OrderStatus;
  const paymentStatus = String(formData.get("paymentStatus") ?? "pending") as PaymentStatus;
  const now = new Date().toISOString();

  const supabase = createSupabaseAdminClient();

  // Read the existing timestamps first. Stamping `now` unconditionally would
  // rewrite paid_at on every later edit — marking a week-old paid order as
  // "shipped" would move its payment time to today and destroy the record of
  // when the customer actually paid.
  const { data: existing, error: readError } = await supabase
    .from("orders")
    .select("paid_at, fulfilled_at")
    .eq("id", id)
    .maybeSingle();

  if (readError) throw new Error(readError.message);

  const isFulfilled = status === "shipped" || status === "delivered";

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      payment_status: paymentStatus,
      // Keep the original timestamp if one exists; only stamp on first transition.
      paid_at: paymentStatus === "paid" ? (existing?.paid_at ?? now) : null,
      fulfilled_at: isFulfilled ? (existing?.fulfilled_at ?? now) : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Put stock back when an order is called off. restore_order_stock is a no-op
  // unless this order's stock was actually decremented, and clears that flag, so
  // toggling between cancelled/refunded can't hand back the same units twice.
  if (status === "cancelled" || status === "refunded") {
    await restoreOrderStock(id);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
  }

  revalidatePath("/admin/orders");
}

function nullableText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
