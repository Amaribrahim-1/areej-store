import { createClient } from "@/lib/supabase/client";

export type DeleteReviewInput = {
  productSlug: string;
};

export type DeleteReviewResult = {
  id: string;
  productId: string;
};

/**
 * Deletes the authenticated customer's review for an active product.
 * Resolves the row from the active product slug + session user — never
 * trusts a client review id. After a successful delete the unique
 * (product_id, user_id) constraint no longer blocks a new insert.
 */
export async function deleteReview(
  input: DeleteReviewInput,
): Promise<DeleteReviewResult> {
  const productSlug = input.productSlug?.trim() ?? "";

  if (productSlug.length === 0) {
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

  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", product.id)
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
