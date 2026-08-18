-- COD: money is not in hand until the order is Delivered.
-- Replace booked sales (non-cancelled) with realized sales (Delivered only).
-- Pending / Shipping stay visible on the pending-count card, not in total_sales.

create or replace function public.get_admin_dashboard_kpis()
returns table (
  total_sales numeric,
  pending_orders integer,
  total_products integer
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_total_sales numeric(10, 2);
  v_pending_orders integer;
  v_total_products integer;
begin
  if not private.is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  select
    coalesce(
      (select sum(o.total) from public.orders o where o.status = 'Delivered'),
      0
    )::numeric(10, 2),
    (select count(*)::integer from public.orders o where o.status = 'Pending'),
    (select count(*)::integer from public.products)
  into v_total_sales, v_pending_orders, v_total_products;

  return query select v_total_sales, v_pending_orders, v_total_products;
end;
$$;

comment on function public.get_admin_dashboard_kpis() is
  'Admin dashboard KPIs: sum of Delivered order totals (COD realized sales), pending order count, all-products count. Admin-only.';
