"use client";

import { useQuery } from "@tanstack/react-query";

import { getAllReviews } from "./getAllReviews";

export const allReviewsQueryKey = ["admin-reviews"] as const;

/** Admin: all reviews across all products, newest first, with product name. */
export function useAllReviews() {
  return useQuery({
    queryKey: allReviewsQueryKey,
    queryFn: getAllReviews,
    // Admin checks this page periodically — 1 min stale time balances freshness
    // with avoiding hammering the RPC on every re-focus.
    staleTime: 60 * 1000,
  });
}
