import "server-only";

import { Product } from "./types";
import { PRODUCTS } from "./products";
import { ProductInsert, ProductRow, ProductStatus } from "./database.types";
import { createSupabaseAdminClient, createSupabasePublicClient, isSupabaseAdminConfigured, isSupabaseConfigured } from "./supabase/server";

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

export function productToInsert(product: Product): ProductInsert {
  return {
    slug: product.slug,
    sku: product.id,
    name: product.name,
    category: product.category,
    brand: null,
    model: null,
    grade: product.grade,
    status: product.stock > 0 ? "active" : "sold_out",
    price_cents: product.price * 100,
    compare_at_cents: product.compareAt ? product.compareAt * 100 : null,
    shipping_cents: product.shipping * 100,
    stock_qty: product.stock,
    low_stock_threshold: 1,
    spec: product.spec,
    specs: product.specs,
    description: product.description,
    condition_notes: null,
    warranty_months: 3,
    images: product.images,
    is_featured: Boolean(product.featured),
    is_visible: true,
  };
}

export async function getStoreProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return PRODUCTS;

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .in("status", ["active", "sold_out"])
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products from Supabase:", error.message);
    return PRODUCTS;
  }

  return data.map(productRowToProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getStoreProducts();
  return products.filter((product) => product.featured);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return PRODUCTS.find((product) => product.slug === slug);

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .in("status", ["active", "sold_out"])
    .maybeSingle();

  if (error) {
    console.error("Failed to load product from Supabase:", error.message);
    return PRODUCTS.find((product) => product.slug === slug);
  }

  return data ? productRowToProduct(data) : undefined;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getStoreProducts();
  return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, limit);
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  if (!isSupabaseAdminConfigured()) {
    return PRODUCTS.map((product) => ({
      ...product,
      sku: product.id,
      status: product.stock > 0 ? "active" : "sold_out",
      isVisible: true,
      lowStockThreshold: 1,
      warrantyMonths: 3,
    }));
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data.map(productRowToAdminProduct);
}

export async function getAdminProduct(id: string): Promise<AdminProduct | undefined> {
  if (!isSupabaseAdminConfigured()) {
    const product = PRODUCTS.find((item) => item.id === id);
    return product
      ? {
          ...product,
          sku: product.id,
          status: product.stock > 0 ? "active" : "sold_out",
          isVisible: true,
          lowStockThreshold: 1,
          warrantyMonths: 3,
        }
      : undefined;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return data ? productRowToAdminProduct(data) : undefined;
}

export async function seedProductsIfEmpty() {
  if (!isSupabaseAdminConfigured()) return { skipped: true, inserted: 0 };

  const supabase = createSupabaseAdminClient();
  const { count, error: countError } = await supabase.from("products").select("id", { count: "exact", head: true });
  if (countError) throw new Error(countError.message);
  if ((count ?? 0) > 0) return { skipped: true, inserted: 0 };

  const { error } = await supabase.from("products").insert(PRODUCTS.map(productToInsert));
  if (error) throw new Error(error.message);

  return { skipped: false, inserted: PRODUCTS.length };
}
