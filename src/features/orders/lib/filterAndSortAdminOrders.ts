import {
  ORDER_STATUSES,
  type AdminOrderSort,
  type OrderStatus,
} from "../constants";
import type { AdminOrder } from "../types";

export type AdminOrdersListParams = {
  status?: OrderStatus;
  sort: AdminOrderSort;
};

/**
 * Filters and sorts an already-fetched admin list.
 * Newest-first matches `list_admin_orders`. Status order follows
 * `ORDER_STATUSES` (pipeline order), then newest within a status.
 */
export function filterAndSortAdminOrders(
  orders: AdminOrder[],
  params: AdminOrdersListParams,
): AdminOrder[] {
  const filtered = params.status
    ? orders.filter((order) => order.status === params.status)
    : orders;

  return [...filtered].sort((a, b) => compareAdminOrders(a, b, params.sort));
}

function compareAdminOrders(
  a: AdminOrder,
  b: AdminOrder,
  sort: AdminOrderSort,
): number {
  if (sort === "status") {
    const byStatus = statusRank(a.status) - statusRank(b.status);
    if (byStatus !== 0) return byStatus;
    return compareNewestFirst(a, b);
  }

  if (sort === "oldest") {
    return compareNewestFirst(b, a);
  }

  return compareNewestFirst(a, b);
}

function statusRank(status: OrderStatus): number {
  return ORDER_STATUSES.indexOf(status);
}

function compareNewestFirst(a: AdminOrder, b: AdminOrder): number {
  if (a.createdAt !== b.createdAt) {
    return a.createdAt < b.createdAt ? 1 : -1;
  }
  return a.id < b.id ? 1 : -1;
}
