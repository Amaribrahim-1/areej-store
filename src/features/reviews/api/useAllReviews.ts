"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_REVIEWS_STALE_TIME_MS } from "../constants";
import { getAllReviews } from "./getAllReviews";

export const allReviewsQueryKey = ["admin-reviews"] as const;

/** Admin: all reviews across all products, newest first, with product name. */
export function useAllReviews() {
  return useQuery({
    queryKey: allReviewsQueryKey,
    queryFn: getAllReviews,
    staleTime: ADMIN_REVIEWS_STALE_TIME_MS,
  });
}
