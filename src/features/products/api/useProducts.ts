"use client";

import { useQuery } from "@tanstack/react-query";
import { PRODUCTS_STALE_TIME_MS } from "../constants";
import type { ProductsQueryParams } from "../types";
import { getProducts } from "./getProducts";

/** Stable query key factory — include every param that changes the result. */
export function productsQueryKey(params: ProductsQueryParams = {}) {
  return ["products", params] as const;
}

/**
 * Catalog list hook. Server data stays in TanStack Query — never copy into Zustand.
 */
export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: productsQueryKey(params),
    queryFn: () => getProducts(params),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
}
