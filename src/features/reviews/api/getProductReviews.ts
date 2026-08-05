import { createClient } from "@/lib/supabase/client";

import {
  PRODUCT_REVIEWS_DEFAULT_LIMIT,
} from "../constants";
import type { ProductReview, ProductReviewsQueryParams } from "../types";

/**
 * Storefront product reviews API (task 3.11).
 * Lookup by product slug so callers can run this in parallel with getProduct({ slug }).
 * Empty list when the product is missing/inactive or has no reviews (not an error).
 */
export async function getProductReviews(
  params: ProductReviewsQueryParams,
): Promise<ProductReview[]> {
  const supabase = createClient();
  const limit = params.limit ?? PRODUCT_REVIEWS_DEFAULT_LIMIT;

  const { data, error } = await supabase.rpc("list_product_reviews", {
    p_product_slug: params.slug,
    p_limit: limit,
  });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: row.created_at,
    authorName: row.author_name,
  }));
}
