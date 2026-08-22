"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_ORDERS_STALE_TIME_MS } from "../../constants";
import { adminOrderQueryKey } from "../queryKeys";
import { getAdminOrder } from "./getAdminOrder";

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: adminOrderQueryKey(orderId),
    queryFn: () => getAdminOrder(orderId),
    staleTime: ADMIN_ORDERS_STALE_TIME_MS,
  });
}
