-- Areej — Core schema (Phase 1.2)
-- Creates the 7 core tables agreed in schema-draft.md, with column-level
-- constraints only. Explicitly out of scope here: RLS policies (1.3),
-- storage bucket setup (1.4), the place-order RPC (1.5), seed data (1.7).

create extension if not exists "pgcrypto";

-- Shared trigger function: keeps `updated_at` current on every row update.
-- Attached below to every table that has an `updated_at` column.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- profiles
-- =========================================================================
-- One row per auth user. `full_name`/`phone`/`governorate`/`markaz`/
-- `address_text` are nullable because the signup trigger (Phase 5) inserts
-- this row immediately on auth.users insert, before the register form has
-- collected those fields — they get filled in by a follow-up update.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  governorate text,
  markaz text,
  address_text text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- =========================================================================
-- products
-- =========================================================================
-- No price columns here — pricing always lives on product_variants, even
-- for single-size products (schema-draft.md locked rule).
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category text not null check (
    category in ('Perfumes', 'Musk', 'Fermentation', 'Hair Oil')
  ),
  image_url text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- =========================================================================
-- product_variants
-- =========================================================================
-- Every product has at least one variant row (enforced at the app/query
-- layer, not by a DB constraint — Postgres has no "at least one child row"
-- check). `volume_label` is nullable for products with no meaningful size.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id),
  volume_label text,
  original_price numeric(10, 2) not null,
  current_price numeric(10, 2) not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_current_price_valid check (
    current_price > 0 and current_price <= original_price
  )
);

create trigger set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

-- Postgres does not auto-index FK columns (only the referenced PK is
-- indexed) — without this, every catalog query joining variants to their
-- product does a sequential scan.
create index idx_product_variants_product_id on public.product_variants (product_id);

-- =========================================================================
-- orders
-- =========================================================================
-- customer_name/phone/governorate/markaz/address_text are a snapshot of the
-- profile at checkout time — editing the profile later must not change past
-- orders (schema-draft.md locked rule).
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  status text not null default 'Pending' check (
    status in ('Pending', 'Shipping', 'Delivered', 'Cancelled')
  ),
  payment_method text not null default 'cod' check (payment_method in ('cod')),
  total numeric(10, 2) not null,
  customer_name text not null,
  customer_phone text not null,
  governorate text not null,
  markaz text not null,
  address_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create index idx_orders_user_id on public.orders (user_id);

-- =========================================================================
-- order_items
-- =========================================================================
-- product_name/variant_label/unit_price are a snapshot at purchase time.
-- variant_id is ON DELETE RESTRICT so a variant referenced by past order
-- lines can never be hard-deleted at the DB level (task 13.8: "deleted only
-- when safe").
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  product_id uuid not null references public.products (id),
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  product_name text not null,
  variant_label text,
  unit_price numeric(10, 2) not null check (unit_price > 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index idx_order_items_order_id on public.order_items (order_id);
create index idx_order_items_product_id on public.order_items (product_id);
create index idx_order_items_variant_id on public.order_items (variant_id);

-- =========================================================================
-- reviews
-- =========================================================================
-- One review per customer per product (unique constraint, not just a
-- client-side check).
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id),
  user_id uuid not null references public.profiles (id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  constraint reviews_one_per_customer_per_product unique (product_id, user_id)
);

-- `product_id` doesn't need its own index — it's already the leftmost
-- column of the unique constraint's index above. `user_id` is the second
-- column there, so lookups by user alone still need a dedicated index.
create index idx_reviews_user_id on public.reviews (user_id);

-- =========================================================================
-- contact_messages
-- =========================================================================
-- Phone-only contact field per schema-draft.md (no email column).
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);
