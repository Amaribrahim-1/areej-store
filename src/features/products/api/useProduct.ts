"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "./getProduct";
import { PRODUCTS_STALE_TIME_MS } from "../constants";
import type { ProductQueryParams } from "../types";

export const queryKey = (params: ProductQueryParams) => ["product", params];

export function useProduct(params: ProductQueryParams) {
  return useQuery({
    queryKey: queryKey(params),
    queryFn: () => getProduct(params),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
}
