"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, requireAdmin, verifyPassword } from "@/lib/admin-auth";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { OrderStatus, PaymentStatus, ProductGrade, ProductStatus } from "@/lib/database.types";
import { getUnresolvedOrdersForProduct, restoreOrderStock } from "@/lib/orders-db";
import { deleteProductImages, getImageFiles, uploadProductImages } from "@/lib/product-images";
import { MAX_PRODUCTS, countProducts } from "@/lib/products-db";
import { GRADES } from "@/lib/types";
import { slugify } from "@/lib/utils";

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

  /* Cap the catalogue — checked BEFORE the image upload below, so a rejected
     product doesn't leave orphaned files in storage. Only applies to new
     products; editing an existing one is always allowed. */
  if (!id && (await countProducts()) >= MAX_PRODUCTS) {
    throw new Error(`Product limit reached (${MAX_PRODUCTS}). Delete a product before adding another.`);
  }

  /* Always normalise — the field is free text, and a slug with spaces or capitals
     produces a URL that no longer matches the stored value, 404ing a live product.
     Falls back to the product name if the slug field was left blank. */
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug) || slugify(String(formData.get("name") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const compareAtRaw = String(formData.get("compareAt") ?? "").trim();
  const shipping = Number(formData.get("shipping") ?? 150);
  const stock = Number(formData.get("stock") ?? 0);
  const existingImages = lines(formData.get("existingImages")).slice(0, 3);
  const uploadedImages = await uploadProductImages(getImageFiles(formData), slug);
  const images = uploadedImages.length ? uploadedImages : existingImages;
  const grade = String(formData.get("grade") ?? "A");
  if (!GRADES.some((validGrade) => validGrade === grade)) throw new Error("Invalid product grade.");

  const payload = {
    slug,
    sku: nullableText(formData.get("sku")),
    name,
    category,
    brand: nullableText(formData.get("brand")),
    model: nullableText(formData.get("model")),
    grade: grade as ProductGrade,
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

/**
 * Permanently removes a product and its uploaded images.
 *
 * Past orders are unaffected: order_items stores the product name, slug, grade
 * and price at time of sale, and its product_id is ON DELETE SET NULL — so order
 * history still reads correctly, it just no longer links to a live product.
 */
export interface DeleteProductState {
  error?: string;
}

export async function deleteProductAction(_prev: DeleteProductState | undefined, formData: FormData): Promise<DeleteProductState> {
  await requireAdmin();
  if (!isSupabaseAdminConfigured()) return { error: "Supabase admin credentials are not configured." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing product id." };

  /* Refuse while the product is on an order that isn't finished. Deleting it
     would null the product_id on that order line, and the stock functions skip
     null lines — so you'd be shipping something the system can no longer track. */
  const blocking = await getUnresolvedOrdersForProduct(id);
  if (blocking.length) {
    const list = blocking
      .slice(0, 3)
      .map((o) => `${o.order_number} (${o.status.replaceAll("_", " ")})`)
      .join(", ");
    const more = blocking.length > 3 ? ` and ${blocking.length - 3} more` : "";
    return {
      error: `Can't delete — this product is on ${blocking.length} unfinished ${
        blocking.length === 1 ? "order" : "orders"
      }: ${list}${more}. Complete or cancel ${blocking.length === 1 ? "it" : "them"} first, or set the product to archived to hide it from the shop.`,
    };
  }

  const supabase = createSupabaseAdminClient();

  // Read the image list first — once the row is gone we can't find the files.
  const { data: product, error: readError } = await supabase.from("products").select("images").eq("id", id).maybeSingle();
  if (readError) return { error: readError.message };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  await deleteProductImages(product?.images ?? []);

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  return {};
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
