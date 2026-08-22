"use client";

import { useQuery } from "@tanstack/react-query";

import { PRODUCTS_STALE_TIME_MS } from "../constants";
import type { ProductQueryParams } from "../types";
import { getProduct } from "./getProduct";
import { productQueryKey } from "./queryKeys";

export function useProduct(params: ProductQueryParams) {
  return useQuery({
    queryKey: productQueryKey(params),
    queryFn: () => getProduct(params),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
}
