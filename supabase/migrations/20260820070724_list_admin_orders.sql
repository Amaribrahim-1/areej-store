-- Admin orders list (task 12.1).
-- SECURITY INVOKER: admin SELECT RLS already covers every orders row;
-- non-admin is rejected before the SELECT runs. Not SECURITY DEFINER —
-- public definer RPCs belong in `private` per the security checklist.
-- A plain `.from("orders")` helper would return a customer's own rows
-- under RLS instead of failing — that is the wrong admin-list contract.

create or replace function public.list_admin_orders()
returns table (
  id uuid,
  status text,
  total numeric,
  customer_name text,
  customer_phone text,
  governorate text,
  markaz text,
  address_text text,
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
    o.id,
    o.status,
    o.total,
    o.customer_name,
    o.customer_phone,
    o.governorate,
    o.markaz,
    o.address_text,
    o.created_at
  from public.orders o
  order by o.created_at desc, o.id desc;
end;
$$;

comment on function public.list_admin_orders() is
  'Admin order list: all orders, newest first, snapshot contact/address fields. No line items. Admin-only.';

revoke all on function public.list_admin_orders() from public;
revoke all on function public.list_admin_orders() from anon, authenticated;
grant execute on function public.list_admin_orders() to authenticated;

-- Admin list is newest-first across every status; the pending partial
-- index does not cover that scan.
create index if not exists idx_orders_created_at
  on public.orders (created_at desc);
