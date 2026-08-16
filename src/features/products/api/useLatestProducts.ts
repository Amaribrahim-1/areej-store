"use client";

import { useQuery } from "@tanstack/react-query";

import { HOME_LATEST_PAGE_SIZE, PRODUCTS_STALE_TIME_MS } from "../constants";
import type { LatestProductsParams } from "../types";
import { getLatestProducts } from "./getProducts";

export function latestProductsQueryKey(pageSize: number) {
  return ["latest-products", { pageSize }] as const;
}

export function useLatestProducts(params: LatestProductsParams = {}) {
  const pageSize = params.pageSize ?? HOME_LATEST_PAGE_SIZE;

  return useQuery({
    queryKey: latestProductsQueryKey(pageSize),
    queryFn: () => getLatestProducts({ pageSize }),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
}
