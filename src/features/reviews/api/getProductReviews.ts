import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { PRODUCT_REVIEWS_DEFAULT_LIMIT } from "../constants";
import type { ProductReview, ProductReviewsQueryParams } from "../types";

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

  return (data ?? []).map((row) => {
    const sanitized =
      row.comment != null && row.comment.length > 0
        ? sanitizePlainText(row.comment)
        : "";

    return {
      id: row.id,
      productId: row.product_id,
      rating: Number(row.rating),
      comment: sanitized.length > 0 ? sanitized : null,
      createdAt: row.created_at,
      authorName: row.author_name,
    };
  });
}
