"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_PRODUCTS_STALE_TIME_MS } from "../../constants";
import { adminProductQueryKey } from "../queryKeys";
import { getAdminProduct } from "./getAdminProduct";

export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: adminProductQueryKey(productId),
    queryFn: () => getAdminProduct(productId),
    staleTime: ADMIN_PRODUCTS_STALE_TIME_MS,
  });
}
