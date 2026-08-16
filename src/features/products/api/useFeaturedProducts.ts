"use client";

import { useQuery } from "@tanstack/react-query";

import { HOME_FEATURED_PAGE_SIZE, PRODUCTS_STALE_TIME_MS } from "../constants";
import type { FeaturedProductsParams } from "../types";
import { getFeaturedProducts } from "./getProducts";

export function featuredProductsQueryKey(pageSize: number) {
  return ["featured-products", { pageSize }] as const;
}

export function useFeaturedProducts(params: FeaturedProductsParams = {}) {
  const pageSize = params.pageSize ?? HOME_FEATURED_PAGE_SIZE;

  return useQuery({
    queryKey: featuredProductsQueryKey(pageSize),
    queryFn: () => getFeaturedProducts({ pageSize }),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
}
