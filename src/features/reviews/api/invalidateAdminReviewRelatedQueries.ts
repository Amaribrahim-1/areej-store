import type { QueryClient } from "@tanstack/react-query";

import { productQueryKeyRoot } from "@/features/products/public";

import { HOME_TESTIMONIALS_PAGE_SIZE } from "../constants";
import { allReviewsQueryKey } from "./useAllReviews";
import {
  homeTestimonialsQueryKey,
  productReviewsQueryKeyRoot,
} from "./queryKeys";
import { myProductReviewQueryKeyRoot } from "./useMyProductReview";

/**
 * Invalidate after an admin review delete. Unlike the customer-side helper,
 * the admin list only carries a product name (no slug), so this invalidates
 * by query-key root instead of one exact product — a few extra refetches on
 * a rare, low-traffic admin action is the right trade-off over adding a slug
 * just for cache invalidation.
 */
export function invalidateAdminReviewRelatedQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: allReviewsQueryKey });
  void queryClient.invalidateQueries({ queryKey: productReviewsQueryKeyRoot });
  void queryClient.invalidateQueries({ queryKey: myProductReviewQueryKeyRoot });
  void queryClient.invalidateQueries({ queryKey: productQueryKeyRoot });
  void queryClient.invalidateQueries({
    queryKey: homeTestimonialsQueryKey(HOME_TESTIMONIALS_PAGE_SIZE),
  });
}
