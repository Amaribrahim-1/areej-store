export type AdminDashboardKpis = {
  /** Sum of `orders.total` where status is `Delivered` (EGP). */
  totalSales: number;
  pendingOrders: number;
  totalProducts: number;
};
