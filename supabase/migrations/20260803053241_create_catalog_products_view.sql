-- Catalog read model: one row per product with display price + rating aggregates.
-- Why a view: PostgREST cannot filter/sort/paginate by min(variant.price) or
-- avg(reviews.rating) on an embedded select without loading every row into JS.
-- security_invoker: use the caller's RLS on underlying tables (do not bypass).

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
  coalesce(rv.review_count, 0) as review_count
from public.products p
-- Cheapest current_price wins; sort_order breaks ties (admin display order).
inner join lateral (
  select v.current_price, v.original_price
  from public.product_variants v
  where v.product_id = p.id
  order by v.current_price asc, v.sort_order asc
  limit 1
) dv on true
left join lateral (
  select
    round(avg(r.rating)::numeric, 2) as average_rating,
    count(*)::integer as review_count
  from public.reviews r
  where r.product_id = p.id
) rv on true;

comment on view public.catalog_products is
  'Storefront catalog row: product + display price pair + review aggregates.';

grant select on public.catalog_products to anon, authenticated;
