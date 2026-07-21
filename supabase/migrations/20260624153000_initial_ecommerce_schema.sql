create extension if not exists "pgcrypto";

do $$
begin
  create type product_grade as enum ('A', 'B', 'C');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type product_status as enum ('draft', 'active', 'sold_out', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type order_status as enum (
    'pending_payment',
    'paid',
    'processing',
    'ready_to_ship',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception
  when duplicate_object then null;
end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sku text unique,
  name text not null,
  category text not null,
  brand text,
  model text,
  grade product_grade not null default 'A',
  status product_status not null default 'draft',
  price_cents integer not null check (price_cents >= 0),
  compare_at_cents integer check (compare_at_cents is null or compare_at_cents >= price_cents),
  shipping_cents integer not null default 15000 check (shipping_cents >= 0),
  stock_qty integer not null default 0 check (stock_qty >= 0),
  low_stock_threshold integer not null default 1 check (low_stock_threshold >= 0),
  spec text not null default '',
  specs text[] not null default '{}',
  description text not null default '',
  condition_notes text,
  warranty_months integer not null default 3 check (warranty_months >= 0),
  images text[] not null default '{}',
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_status_idx on products (status);
create index if not exists products_featured_idx on products (is_featured) where is_featured = true;
create index if not exists products_visible_active_idx on products (is_visible, status);

drop trigger if exists set_products_updated_at on products;
create trigger set_products_updated_at
before update on products
for each row execute function set_updated_at();

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  status order_status not null default 'pending_payment',
  payment_status payment_status not null default 'pending',
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address_line1 text not null,
  shipping_address_line2 text,
  shipping_city text not null,
  shipping_province text,
  shipping_postal_code text not null,
  shipping_country text not null default 'South Africa',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  yoco_checkout_id text,
  payment_reference text,
  notes text,
  placed_at timestamptz not null default now(),
  paid_at timestamptz,
  fulfilled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_payment_status_idx on orders (payment_status);
create index if not exists orders_customer_email_idx on orders (customer_email);
create index if not exists orders_placed_at_idx on orders (placed_at desc);

drop trigger if exists set_orders_updated_at on orders;
create trigger set_orders_updated_at
before update on orders
for each row execute function set_updated_at();

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_slug text not null,
  product_name text not null,
  product_sku text,
  grade product_grade,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  image text,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on order_items (order_id);
create index if not exists order_items_product_id_idx on order_items (product_id);

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "Public can read active products" on products;
create policy "Public can read active products"
on products for select
using (is_visible = true and status in ('active', 'sold_out'));

-- Admin writes are handled by Next.js server routes using SUPABASE_SERVICE_ROLE_KEY.
-- Do not expose the service role key to the browser.

insert into products (
  slug, sku, name, category, brand, model, grade, status, price_cents, compare_at_cents,
  shipping_cents, stock_qty, spec, specs, description, images, is_featured
) values
  (
    'macbook-pro-14-m1-pro', 'SS-MBP14-M1PRO-A', 'MacBook Pro 14" M1 Pro', 'MacBooks', 'Apple', 'MacBook Pro 14"', 'A', 'active',
    1249900, 1599900, 15000, 4, '16GB · 512GB SSD',
    array['Apple M1 Pro (8-core)', '16GB unified memory', '512GB SSD', '14.2" Liquid Retina XDR', 'Battery cycle count < 80'],
    'A Grade-A MacBook Pro 14" with the M1 Pro chip — tested, inspected and cosmetically near-flawless. Ideal for developers, designers and creators who want pro performance without the brand-new price.',
    array['/products/placeholder-macbook.svg'], true
  ),
  (
    'dell-latitude-7420-i7', 'SS-DELL7420-I7-B', 'Dell Latitude 7420 i7', 'Laptops', 'Dell', 'Latitude 7420', 'B', 'active',
    629900, null, 15000, 7, '16GB · 256GB SSD',
    array['Intel Core i7-1165G7', '16GB DDR4', '256GB NVMe SSD', '14" FHD', 'Windows 11 Pro'],
    'A reliable business-class ultrabook with light cosmetic wear. Fully functional and great value for work, study or everyday use.',
    array['/products/placeholder-laptop.svg'], true
  ),
  (
    'iphone-13-128gb', 'SS-IP13-128-A', 'iPhone 13 128GB', 'iPhones', 'Apple', 'iPhone 13', 'A', 'active',
    899900, 1199900, 15000, 9, 'Battery 92% · Unlocked',
    array['128GB storage', 'Battery health 92%', 'Network unlocked', 'Face ID tested', 'Includes charging cable'],
    'Grade-A iPhone 13, network unlocked with strong battery health. Inspected inside and out — looks and runs like new.',
    array['/products/placeholder-iphone.svg'], true
  )
on conflict (slug) do nothing;
