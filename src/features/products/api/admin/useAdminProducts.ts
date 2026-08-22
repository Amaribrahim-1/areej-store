"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_PRODUCTS_STALE_TIME_MS } from "../../constants";
import { getAdminProducts } from "./getAdminProducts";

export const adminProductsQueryKey = () => ["admin-products"] as const;

export function useAdminProducts() {
  return useQuery({
    queryKey: adminProductsQueryKey(),
    queryFn: getAdminProducts,
    staleTime: ADMIN_PRODUCTS_STALE_TIME_MS,
  });
}
