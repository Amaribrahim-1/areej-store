"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_ORDERS_STALE_TIME_MS } from "../../constants";
import { adminOrdersQueryKey } from "../queryKeys";
import { getAdminOrders } from "./getAdminOrders";

export function useAdminOrders() {
  return useQuery({
    queryKey: adminOrdersQueryKey(),
    queryFn: getAdminOrders,
    staleTime: ADMIN_ORDERS_STALE_TIME_MS,
  });
}
