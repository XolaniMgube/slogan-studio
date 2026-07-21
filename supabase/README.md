# Supabase Setup

## 1. Create the project

Create a Supabase project for Slogan Studio.

## 2. Run the database migration

Open the Supabase SQL Editor and run both migration files in order:

```sql
-- supabase/migrations/20260624153000_initial_ecommerce_schema.sql
-- supabase/migrations/20260624162000_product_image_storage.sql
```

Paste the full contents of each migration file into the editor and run them one at a time.

## 3. Add environment variables

Add these values to `.env.local` for local development and to Vercel for production:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The anon key is safe for browser reads that respect RLS. The service role key must stay server-only.

## 4. Seed products

After the env vars are set and the dev server has restarted:

1. Visit `/admin/login`.
2. Log in with the local admin password.
3. Go to `/admin/products`.
4. Click `Seed mock products`.

The storefront will then read products from Supabase.
