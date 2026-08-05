"use client";

import { useQuery } from "@tanstack/react-query";
import { PRODUCTS_STALE_TIME_MS } from "../constants";
import type { ProductsQueryParams } from "../types";
import { getProducts } from "./getProducts";

export function productsQueryKey(params: ProductsQueryParams = {}) {
  return ["products", params] as const;
}

export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: productsQueryKey(params),
    queryFn: () => getProducts(params),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
}
