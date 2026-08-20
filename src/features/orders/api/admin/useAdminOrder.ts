"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_ORDERS_STALE_TIME_MS } from "../../constants";
import { getAdminOrder } from "./getAdminOrder";

export const adminOrderQueryKey = (orderId: string) =>
  ["admin-order", orderId] as const;

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: adminOrderQueryKey(orderId),
    queryFn: () => getAdminOrder(orderId),
    staleTime: ADMIN_ORDERS_STALE_TIME_MS,
  });
}
