-- Areej — Admin: all reviews list (task 14.1).
-- Returns every review across all products, newest first, joined with the
-- product name so Alaa doesn't have to visit each product page.
--
-- SECURITY DEFINER (not INVOKER): profiles has owner/admin RLS so a SECURITY
-- INVOKER function running as `authenticated` cannot read other users' profiles
-- rows. SECURITY DEFINER runs as the function owner (bypasses profiles RLS).
-- The admin guard below makes this safe: any non-admin call raises NOT_ADMIN
-- before a single row is read.
-- Same pattern as list_product_reviews (task 3.11).

-- DROP first: return type changed from the initial push (numeric → integer for
-- rating). `create or replace` cannot change return types; drop is safe here
-- since this function had no dependents when the fix was applied.
drop function if exists public.list_admin_reviews();

create or replace function public.list_admin_reviews()
returns table (
  id          uuid,
  product_id  uuid,
  product_name text,
  rating      integer,
  comment     text,
  author_name text,
  created_at  timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  return query
  select
    r.id,
    r.product_id,
    p.name                                          as product_name,
    r.rating,
    r.comment,
    coalesce(nullif(trim(pr.full_name), ''), 'عميل') as author_name,
    r.created_at
  from public.reviews r
  join public.products p  on p.id = r.product_id
  join public.profiles pr on pr.id = r.user_id
  order by r.created_at desc;
end;
$$;

comment on function public.list_admin_reviews() is
  'Admin: all reviews across all products, newest first, joined with product name and author. Admin-only.';

revoke all on function public.list_admin_reviews() from public;
revoke all on function public.list_admin_reviews() from anon, authenticated;
grant execute on function public.list_admin_reviews() to authenticated;
