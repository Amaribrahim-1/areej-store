import { createClient } from "@/lib/supabase/client";

export type DeleteAdminReviewInput = {
  reviewId: string;
};

export type DeleteAdminReviewResult = {
  id: string;
  productId: string;
};

/**
 * Admin moderation delete — removes any review by id, regardless of author.
 * RLS (`reviews_delete_admin`) is the real guard: a non-admin session gets
 * zero rows deleted here, not an error, so REVIEW_NOT_FOUND also covers
 * "not actually an admin."
 */
export async function deleteAdminReview(
  input: DeleteAdminReviewInput,
): Promise<DeleteAdminReviewResult> {
  const reviewId = input.reviewId?.trim() ?? "";

  if (reviewId.length === 0) {
    throw new Error("INVALID_REVIEW_PAYLOAD");
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .select("id, product_id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("REVIEW_NOT_FOUND");
  }

  return {
    id: data.id,
    productId: data.product_id,
  };
}
