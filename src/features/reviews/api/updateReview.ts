import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { reviewSchema } from "../schema";

export type UpdateReviewInput = {
  productSlug: string;
  rating: number;
  comment?: string;
};

export type UpdateReviewResult = {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

/**
 * Replaces the authenticated customer's review for an active product.
 * Re-validates with `reviewSchema` before any Supabase write.
 * Sanitizes free-text `comment` with `sanitizePlainText` before update.
 * Resolves the row from the active product slug + session user — never
 * trusts a client review id. Omitted or blank `comment` stores `null`
 * (clears an existing comment).
 */
export async function updateReview(
  input: UpdateReviewInput,
): Promise<UpdateReviewResult> {
  const parsed = reviewSchema.safeParse({
    rating: input.rating,
    comment: input.comment,
  });
  const productSlug = input.productSlug?.trim() ?? "";

  if (!parsed.success || productSlug.length === 0) {
    throw new Error("INVALID_REVIEW_PAYLOAD");
  }

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("UNAUTHENTICATED");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .eq("status", "active")
    .maybeSingle();

  if (productError) {
    throw productError;
  }

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const rawComment = parsed.data.comment?.trim() ?? "";
  const sanitizedComment =
    rawComment.length > 0 ? sanitizePlainText(rawComment) : "";
  const comment = sanitizedComment.length > 0 ? sanitizedComment : null;

  const { data, error } = await supabase
    .from("reviews")
    .update({
      rating: parsed.data.rating,
      comment,
    })
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .select("id, product_id, rating, comment, created_at")
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
    rating: Number(data.rating),
    comment: data.comment,
    createdAt: data.created_at,
  };
}
