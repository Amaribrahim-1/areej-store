-- Storefront catalog: expose display variant id + variant count for product-card add-to-cart.
-- DROP + CREATE required: CREATE OR REPLACE cannot insert columns mid-select list.
drop view if exists public.catalog_products;

create view public.catalog_products
with (security_invoker = true) as
select
  p.id,
  p.name,
  p.slug,
  p.description,
  p.category,
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
  vc.variant_count
from public.products p
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
left join lateral (
  select
    round(avg(r.rating)::numeric, 2) as average_rating,
    count(*)::integer as review_count
  from public.reviews r
  where r.product_id = p.id
) rv on true;

comment on view public.catalog_products is
  'Storefront catalog row: product + display price/variant + variant_count + review aggregates + name_normalized for search.';

grant select on public.catalog_products to anon, authenticated;
