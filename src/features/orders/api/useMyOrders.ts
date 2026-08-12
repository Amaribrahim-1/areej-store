"use client";

import { useQuery } from "@tanstack/react-query";

import { MY_ORDERS_STALE_TIME_MS } from "../constants";
import { getMyOrders } from "./getMyOrders";

export const myOrdersQueryKey = () => ["my-orders"];

export function useMyOrders() {
  return useQuery({
    queryKey: myOrdersQueryKey(),
    queryFn: getMyOrders,
    staleTime: MY_ORDERS_STALE_TIME_MS,
  });
}
