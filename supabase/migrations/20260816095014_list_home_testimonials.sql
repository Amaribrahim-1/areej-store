-- Home testimonials: top-rated reviews with a text comment (task 9.5).
-- Why SECURITY DEFINER: same as list_product_reviews — profiles RLS is
-- owner/admin-only, but the storefront must show author display names
-- without exposing phone/address. Returns only safe fields + product label.
-- No separate testimonials table (spec decision #9).

create or replace function public.list_home_testimonials(
  p_limit integer default 4
)
returns table (
  id uuid,
  product_id uuid,
  product_name text,
  product_slug text,
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
    p.name as product_name,
    p.slug as product_slug,
    r.rating,
    r.comment,
    r.created_at,
    coalesce(nullif(trim(pr.full_name), ''), 'عميل') as author_name
  from public.reviews r
  inner join public.products p
    on p.id = r.product_id
  inner join public.profiles pr
    on pr.id = r.user_id
  where p.status = 'active'
    and r.comment is not null
    and length(btrim(r.comment)) > 0
  order by r.rating desc, r.created_at desc
  limit greatest(1, least(coalesce(p_limit, 4), 50));
$$;

comment on function public.list_home_testimonials(integer) is
  'Storefront Home: top-rated reviews with a text comment on active products, with safe author_name and product label.';

revoke all on function public.list_home_testimonials(integer) from public;
revoke all on function public.list_home_testimonials(integer) from anon, authenticated;
grant execute on function public.list_home_testimonials(integer) to anon, authenticated;

create index if not exists idx_reviews_home_testimonials
  on public.reviews (rating desc, created_at desc)
  where comment is not null and btrim(comment) <> '';
