import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import type { AdminReview } from "../types";

export async function getAllReviews(): Promise<AdminReview[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("list_admin_reviews");

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const rawComment = row.comment;
    const sanitized =
      rawComment != null && rawComment.length > 0
        ? sanitizePlainText(rawComment)
        : "";

    return {
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      rating: Number(row.rating),
      comment: sanitized.length > 0 ? sanitized : null,
      authorName: row.author_name,
      createdAt: row.created_at,
    };
  });
}
