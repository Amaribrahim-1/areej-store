import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import type { MyProductReview, MyProductReviewQueryParams } from "../types";

/**
 * Returns the authenticated customer's review for an active product slug, or null.
 * Guests and missing/inactive products → null (not an error).
 * Enforced uniqueness lives in DB: `reviews_one_per_customer_per_product`.
 */
export async function getMyProductReview(
  params: MyProductReviewQueryParams,
): Promise<MyProductReview | null> {
  const slug = params.slug?.trim() ?? "";
  if (slug.length === 0) {
    return null;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      product_id,
      rating,
      comment,
      created_at,
      products!inner (
        slug,
        status
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("products.slug", slug)
    .eq("products.status", "active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const sanitized =
    data.comment != null && data.comment.length > 0
      ? sanitizePlainText(data.comment)
      : "";

  return {
    id: data.id,
    productId: data.product_id,
    rating: Number(data.rating),
    comment: sanitized.length > 0 ? sanitized : null,
    createdAt: data.created_at,
  };
}
