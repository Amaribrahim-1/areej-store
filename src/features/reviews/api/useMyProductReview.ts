"use client";

import { useQuery } from "@tanstack/react-query";

import { PRODUCT_REVIEWS_STALE_TIME_MS } from "../constants";
import type { MyProductReviewQueryParams } from "../types";
import { getMyProductReview } from "./getMyProductReview";

export const myProductReviewQueryKey = (params: MyProductReviewQueryParams) => [
  "my-product-review",
  params,
];

export const myProductReviewQueryKeyRoot = ["my-product-review"] as const;

export function useMyProductReview(
  params: MyProductReviewQueryParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: myProductReviewQueryKey(params),
    queryFn: () => getMyProductReview(params),
    enabled,
    staleTime: PRODUCT_REVIEWS_STALE_TIME_MS,
  });
}
