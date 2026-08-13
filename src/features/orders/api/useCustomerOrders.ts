"use client";

import { useQuery } from "@tanstack/react-query";

import { CUSTOMER_ORDERS_STALE_TIME_MS } from "../constants";
import { getCustomerOrders } from "./getCustomerOrders";

export const customerOrdersQueryKey = () => ["customer-orders"];

export function useCustomerOrders() {
  return useQuery({
    queryKey: customerOrdersQueryKey(),
    queryFn: getCustomerOrders,
    staleTime: CUSTOMER_ORDERS_STALE_TIME_MS,
  });
}
