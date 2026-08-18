import { createClient } from "@/lib/supabase/client";

import type { AdminDashboardKpis } from "../types";

/**
 * Returns the three admin dashboard KPIs as a single DB aggregate.
 * `totalSales` is COD realized sales (Delivered only). Pending and Shipping
 * are not money in hand yet; only `Pending` is counted on the pending card.
 * Non-admin sessions fail with `NOT_ADMIN`.
 * An empty shop is still one row of zeros — never `null`.
 */
export async function getAdminDashboardKpis(): Promise<AdminDashboardKpis> {
  const supabase = createClient();

  const { data: kpiRow, error } = await supabase
    .rpc("get_admin_dashboard_kpis")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!kpiRow) {
    throw new Error("get_admin_dashboard_kpis returned no row");
  }

  return toAdminDashboardKpis(kpiRow);
}

function toAdminDashboardKpis(kpiRow: {
  total_sales: number;
  pending_orders: number;
  total_products: number;
}): AdminDashboardKpis {
  const totalSales = Number(kpiRow.total_sales);
  const pendingOrders = Number(kpiRow.pending_orders);
  const totalProducts = Number(kpiRow.total_products);

  if (
    !Number.isFinite(totalSales) ||
    !Number.isFinite(pendingOrders) ||
    !Number.isFinite(totalProducts)
  ) {
    throw new Error("get_admin_dashboard_kpis returned non-numeric KPIs");
  }

  return {
    totalSales,
    pendingOrders,
    totalProducts,
  };
}
