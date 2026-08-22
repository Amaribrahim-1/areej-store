"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_PRODUCTS_STALE_TIME_MS } from "../../constants";
import { adminProductsQueryKey } from "../queryKeys";
import { getAdminProducts } from "./getAdminProducts";

export function useAdminProducts() {
  return useQuery({
    queryKey: adminProductsQueryKey(),
    queryFn: getAdminProducts,
    staleTime: ADMIN_PRODUCTS_STALE_TIME_MS,
  });
}
