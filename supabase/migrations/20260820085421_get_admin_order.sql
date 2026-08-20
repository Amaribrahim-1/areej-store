-- Admin order details (task 12.3).
-- SECURITY INVOKER: admin SELECT RLS already covers the order and its
-- items; non-admin is rejected before the SELECT runs. Not SECURITY
-- DEFINER — public definer RPCs belong in `private` per the security
-- checklist.
-- A plain `.from("orders")` helper would return a customer's own order
-- under RLS instead of failing — that is the wrong admin-detail contract.

create or replace function public.get_admin_order(p_order_id uuid)
returns table (
  id uuid,
  status text,
  total numeric,
  payment_method text,
  customer_name text,
  customer_phone text,
  governorate text,
  markaz text,
  address_text text,
  created_at timestamptz,
  items jsonb
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
    o.payment_method,
    o.customer_name,
    o.customer_phone,
    o.governorate,
    o.markaz,
    o.address_text,
    o.created_at,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'variant_label', oi.variant_label,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'line_total', oi.line_total
          )
          order by oi.id
        )
        from public.order_items oi
        where oi.order_id = o.id
      ),
      '[]'::jsonb
    ) as items
  from public.orders o
  where o.id = p_order_id;
end;
$$;

comment on function public.get_admin_order(uuid) is
  'Admin order details: one order snapshot plus line-item snapshots. Missing id returns no row. Admin-only.';

revoke all on function public.get_admin_order(uuid) from public;
revoke all on function public.get_admin_order(uuid) from anon, authenticated;
grant execute on function public.get_admin_order(uuid) to authenticated;
