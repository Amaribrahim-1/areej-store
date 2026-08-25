import type { ProductReviewsQueryParams } from "../types";

export function homeTestimonialsQueryKey(pageSize: number) {
  return ["home-testimonials", { pageSize }] as const;
}

export const productReviewsQueryKey = (params: ProductReviewsQueryParams) => [
  "product-reviews",
  params,
];

export const productReviewsQueryKeyRoot = ["product-reviews"] as const;
