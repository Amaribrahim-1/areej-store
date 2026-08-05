-- Storefront product reviews read model (task 3.11).
-- Why SECURITY DEFINER: profiles RLS is owner/admin-only, but the storefront
-- must show author display names next to public reviews without exposing
-- phone/address. This RPC returns only safe review fields + full_name.
-- Lookup by product slug so the details page can fetch reviews in parallel
-- with getProduct({ slug }) — no wait for product.id (avoids waterfall).

create or replace function public.list_product_reviews(
  p_product_slug text,
  p_limit integer default 20
)
returns table (
  id uuid,
  product_id uuid,
  rating integer,
  comment text,
  created_at timestamptz,
  author_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    r.id,
    r.product_id,
    r.rating,
    r.comment,
    r.created_at,
    coalesce(nullif(trim(pr.full_name), ''), 'عميل') as author_name
  from public.reviews r
  inner join public.products p
    on p.id = r.product_id
  inner join public.profiles pr
    on pr.id = r.user_id
  where p.slug = p_product_slug
    and p.status = 'active'
  order by r.created_at desc
  limit greatest(1, least(coalesce(p_limit, 20), 50));
$$;

comment on function public.list_product_reviews(text, integer) is
  'Storefront: reviews for an active product by slug, with safe author_name.';

revoke all on function public.list_product_reviews(text, integer) from public;
grant execute on function public.list_product_reviews(text, integer) to anon, authenticated;
