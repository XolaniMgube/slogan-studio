export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProductGrade = "NEW" | "A" | "B" | "C";
export type ProductStatus = "draft" | "active" | "sold_out" | "archived";
export type OrderStatus = "pending_payment" | "paid" | "processing" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_grade: ProductGrade;
      product_status: ProductStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export interface ProductRow {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  grade: ProductGrade;
  status: ProductStatus;
  price_cents: number;
  compare_at_cents: number | null;
  shipping_cents: number;
  stock_qty: number;
  low_stock_threshold: number;
  spec: string;
  specs: string[];
  description: string;
  condition_notes: string | null;
  warranty_months: number;
  images: string[];
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = Partial<ProductInsert>;

export interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_province: string | null;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal_cents: number;
  shipping_cents: number;
  discount_cents: number;
  total_cents: number;
  ikhokha_checkout_id: string | null;
  /** True once mark_order_paid has cleanly removed this order's stock. Drives restore-on-cancel. */
  stock_decremented: boolean;
  payment_reference: string | null;
  notes: string | null;
  placed_at: string;
  paid_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderInsert = Omit<OrderRow, "id" | "created_at" | "updated_at" | "placed_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  placed_at?: string;
};

export type OrderUpdate = Partial<OrderInsert>;

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_slug: string;
  product_name: string;
  product_sku: string | null;
  grade: ProductGrade | null;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  image: string | null;
  created_at: string;
}

export type OrderItemInsert = Omit<OrderItemRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type OrderItemUpdate = Partial<OrderItemInsert>;
