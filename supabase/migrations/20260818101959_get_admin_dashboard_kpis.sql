-- Admin dashboard KPIs (tasks 11.4 / 11.5).
-- Aggregate in Postgres so the client never fetches orders/products to sum
-- in JS. SECURITY INVOKER: admin SELECT RLS already covers all rows;
-- non-admin is rejected before the aggregates run. Not SECURITY DEFINER —
-- public definer RPCs belong in `private` per the security checklist.

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
      (select sum(o.total) from public.orders o where o.status <> 'Cancelled'),
      0
    )::numeric(10, 2),
    (select count(*)::integer from public.orders o where o.status = 'Pending'),
    (select count(*)::integer from public.products)
  into v_total_sales, v_pending_orders, v_total_products;

  return query select v_total_sales, v_pending_orders, v_total_products;
end;
$$;

comment on function public.get_admin_dashboard_kpis() is
  'Admin dashboard KPIs: sum of non-cancelled order totals, pending order count, all-products count. Admin-only.';

revoke all on function public.get_admin_dashboard_kpis() from public;
revoke all on function public.get_admin_dashboard_kpis() from anon, authenticated;
grant execute on function public.get_admin_dashboard_kpis() to authenticated;

-- Pending count is the filtered KPI; a partial index stays small as most
-- orders leave Pending.
create index if not exists idx_orders_pending
  on public.orders (created_at)
  where status = 'Pending';
