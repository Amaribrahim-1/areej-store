"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_ORDERS_STALE_TIME_MS } from "../../constants";
import { getAdminOrders } from "./getAdminOrders";

export const adminOrdersQueryKey = () => ["admin-orders"] as const;

export function useAdminOrders() {
  return useQuery({
    queryKey: adminOrdersQueryKey(),
    queryFn: getAdminOrders,
    staleTime: ADMIN_ORDERS_STALE_TIME_MS,
  });
}
