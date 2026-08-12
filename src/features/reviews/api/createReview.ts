import { createClient } from "@/lib/supabase/client";

import { reviewSchema } from "../schema";

export type CreateReviewInput = {
  productSlug: string;
  rating: number;
  comment?: string;
};

export type CreateReviewResult = {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

/**
 * Inserts a product review for the authenticated customer.
 * Re-validates with `reviewSchema` before any Supabase write.
 * Resolves `product_id` from an active product slug — never trusts a client product id.
 */
export async function createReview(
  input: CreateReviewInput,
): Promise<CreateReviewResult> {
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

  const comment =
    parsed.data.comment && parsed.data.comment.length > 0
      ? parsed.data.comment
      : null;

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: product.id,
      user_id: user.id,
      rating: parsed.data.rating,
      comment,
    })
    .select("id, product_id, rating, comment, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("REVIEW_ALREADY_EXISTS");
    }
    throw error;
  }

  return {
    id: data.id,
    productId: data.product_id,
    rating: Number(data.rating),
    comment: data.comment,
    createdAt: data.created_at,
  };
}
