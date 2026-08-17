import type { QueryClient } from "@tanstack/react-query";

import { productQueryKey } from "@/features/products/api/productQueryKey";

import { HOME_TESTIMONIALS_PAGE_SIZE } from "../constants";
import { homeTestimonialsQueryKey } from "./useHomeTestimonials";
import { myProductReviewQueryKey } from "./useMyProductReview";
import { productReviewsQueryKey } from "./useProductReviews";

/** Invalidate every query a review create/update/delete can change. */
export function invalidateReviewRelatedQueries(
  queryClient: QueryClient,
  productSlug: string,
) {
  void queryClient.invalidateQueries({
    queryKey: productReviewsQueryKey({ slug: productSlug }),
  });
  void queryClient.invalidateQueries({
    queryKey: myProductReviewQueryKey({ slug: productSlug }),
  });
  void queryClient.invalidateQueries({
    queryKey: homeTestimonialsQueryKey(HOME_TESTIMONIALS_PAGE_SIZE),
  });
  void queryClient.invalidateQueries({
    queryKey: productQueryKey({ slug: productSlug }),
  });
}
