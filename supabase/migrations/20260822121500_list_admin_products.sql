-- Admin products list (task 13.1).
-- SECURITY INVOKER: admin SELECT RLS already covers inactive products;
-- non-admin is rejected before the SELECT runs. Not SECURITY DEFINER —
-- public definer RPCs belong in `private` per the security checklist.
-- A plain `.from("catalog_products")` without the status filter would
-- return only active rows for a customer under RLS instead of failing —
-- that is the wrong admin-list contract.

create or replace function public.list_admin_products()
returns table (
  id uuid,
  name text,
  slug text,
  category text,
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
    p.status,
    dv.current_price,
    dv.original_price,
    p.created_at
  from public.products p
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
  'Admin product list: all products including inactive, newest first, cheapest-variant display prices. Admin-only.';

revoke all on function public.list_admin_products() from public;
revoke all on function public.list_admin_products() from anon, authenticated;
grant execute on function public.list_admin_products() to authenticated;

-- Admin list is newest-first across every status; idx_products_status
-- does not cover that scan.
create index if not exists idx_products_created_at
  on public.products (created_at desc);
