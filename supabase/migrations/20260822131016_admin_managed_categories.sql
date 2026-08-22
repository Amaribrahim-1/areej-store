-- Admin-managed product categories (pulled into Phase 13 from backlog).
-- Replaces the products.category check constraint with a categories table
-- so Alaa can add labels from the product form. No delete: products FK
-- is ON DELETE RESTRICT. Catalog filter and admin list read labels from DB.

create table public.categories (
  slug text primary key,
  label text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.categories is
  'Storefront + admin product categories. slug is the products.category value and filter key.';

insert into public.categories (slug, label, sort_order)
values
  ('Perfumes', 'عطور', 1),
  ('Musk', 'مسك', 2),
  ('Fermentation', 'مخمرية', 3),
  ('Hair Oil', 'زيوت الشعر', 4);

alter table public.products
  drop constraint if exists products_category_check;

alter table public.products
  add constraint products_category_fkey
  foreign key (category) references public.categories (slug)
  on update cascade
  on delete restrict;

create index if not exists idx_products_category
  on public.products (category);

alter table public.categories enable row level security;

create policy categories_select_anyone
on public.categories
for select
to anon, authenticated
using (true);

create policy categories_insert_admin
on public.categories
for insert
to authenticated
with check ((select private.is_admin()));

grant select on public.categories to anon, authenticated;
grant insert on public.categories to authenticated;
revoke update, delete on public.categories from anon, authenticated;

-- Recreate catalog view with Arabic category_label (DROP required to add a column).
drop view if exists public.catalog_products;

create view public.catalog_products
with (security_invoker = true) as
select
  p.id,
  p.name,
  p.slug,
  p.description,
  p.category,
  cat.label as category_label,
  p.image_url,
  p.status,
  p.created_at,
  p.updated_at,
  dv.current_price as display_current_price,
  dv.original_price as display_original_price,
  rv.average_rating,
  coalesce(rv.review_count, 0) as review_count,
  private.normalize_arabic(p.name) as name_normalized,
  dv.id as display_variant_id,
  vc.variant_count,
  coalesce(ds.max_discount_ratio, 0) > 0 as has_discount,
  coalesce(ds.max_discount_ratio, 0) as discount_depth
from public.products p
inner join public.categories cat on cat.slug = p.category
inner join lateral (
  select v.id, v.current_price, v.original_price
  from public.product_variants v
  where v.product_id = p.id
  order by v.current_price asc, v.sort_order asc
  limit 1
) dv on true
inner join lateral (
  select count(*)::integer as variant_count
  from public.product_variants v
  where v.product_id = p.id
) vc on true
inner join lateral (
  select
    max(
      (v.original_price - v.current_price) / nullif(v.original_price, 0)
    ) as max_discount_ratio
  from public.product_variants v
  where v.product_id = p.id
) ds on true
left join lateral (
  select
    round(avg(r.rating)::numeric, 2) as average_rating,
    count(*)::integer as review_count
  from public.reviews r
  where r.product_id = p.id
) rv on true;

comment on view public.catalog_products is
  'Storefront catalog row: product + display price/variant + variant_count + review aggregates + name_normalized + discount fields + category_label.';

grant select on public.catalog_products to anon, authenticated;

-- Return type gained category_label — REPLACE cannot change OUT columns.
drop function if exists public.list_admin_products();

create function public.list_admin_products()
returns table (
  id uuid,
  name text,
  slug text,
  category text,
  category_label text,
  status text,
  current_price numeric,
  original_price numeric,
  created_at timestamptz
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  return query
  select
    p.id,
    p.name,
    p.slug,
    p.category,
    cat.label,
    p.status,
    dv.current_price,
    dv.original_price,
    p.created_at
  from public.products p
  inner join public.categories cat on cat.slug = p.category
  inner join lateral (
    select v.current_price, v.original_price
    from public.product_variants v
    where v.product_id = p.id
    order by v.current_price asc, v.sort_order asc
    limit 1
  ) dv on true
  order by p.created_at desc, p.id desc;
end;
$$;

comment on function public.list_admin_products() is
  'Admin product list: all products including inactive, newest first, cheapest-variant display prices, category_label. Admin-only.';

revoke all on function public.list_admin_products() from public;
revoke all on function public.list_admin_products() from anon, authenticated;
grant execute on function public.list_admin_products() to authenticated;
