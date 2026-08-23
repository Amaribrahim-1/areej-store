"use client";

import { useQuery } from "@tanstack/react-query";

import { PRODUCT_REVIEWS_STALE_TIME_MS } from "../constants";
import type { ProductReviewsQueryParams } from "../types";
import { getProductReviews } from "./getProductReviews";

export const productReviewsQueryKey = (params: ProductReviewsQueryParams) => [
  "product-reviews",
  params,
];

export const productReviewsQueryKeyRoot = ["product-reviews"] as const;

export function useProductReviews(params: ProductReviewsQueryParams) {
  return useQuery({
    queryKey: productReviewsQueryKey(params),
    queryFn: () => getProductReviews(params),
    staleTime: PRODUCT_REVIEWS_STALE_TIME_MS,
  });
}
