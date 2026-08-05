import "server-only";

import { Product } from "./types";
import { ProductRow, ProductStatus } from "./database.types";
import { createSupabaseAdminClient, createSupabasePublicClient, isSupabaseAdminConfigured, isSupabaseConfigured } from "./supabase/server";

/**
 * PRODUCT DATA — Supabase is the only source of truth.
 *
 * These functions THROW when the database can't be reached. That's deliberate:
 * this layer used to fall back to a hardcoded mock catalogue, which meant a
 * Supabase outage silently served customers products that don't exist, at
 * prices that may be wrong, with an "Add to cart" button. Failing loudly is the
 * safer failure. Callers render a "catalogue unavailable" state instead.
 */

export interface AdminProduct extends Product {
  sku?: string;
  brand?: string;
  model?: string;
  status: ProductStatus;
  isVisible: boolean;
  lowStockThreshold: number;
  conditionNotes?: string;
  warrantyMonths: number;
  createdAt?: string;
  updatedAt?: string;
}

function assertConfigured(configured: boolean) {
  if (!configured) throw new Error("Supabase is not configured — cannot load products.");
}

export function productRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as Product["category"],
    grade: row.grade,
    price: Math.round(row.price_cents / 100),
    compareAt: row.compare_at_cents ? Math.round(row.compare_at_cents / 100) : undefined,
    shipping: Math.round(row.shipping_cents / 100),
    spec: row.spec,
    specs: row.specs,
    description: row.description,
    stock: row.stock_qty,
    images: row.images.length ? row.images : ["/products/placeholder-laptop.svg"],
    featured: row.is_featured,
  };
}

export function productRowToAdminProduct(row: ProductRow): AdminProduct {
  return {
    ...productRowToProduct(row),
    sku: row.sku ?? undefined,
    brand: row.brand ?? undefined,
    model: row.model ?? undefined,
    status: row.status,
    isVisible: row.is_visible,
    lowStockThreshold: row.low_stock_threshold,
    conditionNotes: row.condition_notes ?? undefined,
    warrantyMonths: row.warranty_months,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getStoreProducts(): Promise<Product[]> {
  assertConfigured(isSupabaseConfigured());

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .in("status", ["active", "sold_out"])
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load products: ${error.message}`);

  return data.map(productRowToProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getStoreProducts();
  return products.filter((product) => product.featured);
}

/** Returns undefined when the product genuinely doesn't exist. Throws when the lookup fails. */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  assertConfigured(isSupabaseConfigured());

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .in("status", ["active", "sold_out"])
    .maybeSingle();

  if (error) throw new Error(`Failed to load product "${slug}": ${error.message}`);

  return data ? productRowToProduct(data) : undefined;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getStoreProducts();
  return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, limit);
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  assertConfigured(isSupabaseAdminConfigured());

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data.map(productRowToAdminProduct);
}

export async function getAdminProduct(id: string): Promise<AdminProduct | undefined> {
  assertConfigured(isSupabaseAdminConfigured());

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return data ? productRowToAdminProduct(data) : undefined;
}
