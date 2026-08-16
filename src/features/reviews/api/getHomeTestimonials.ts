import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { HOME_TESTIMONIALS_PAGE_SIZE } from "../constants";
import type { HomeTestimonial, HomeTestimonialsParams } from "../types";

function requireField<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined || value === "") {
    throw new Error(`list_home_testimonials row missing required field: ${field}`);
  }
  return value;
}

export async function getHomeTestimonials(
  params: HomeTestimonialsParams = {},
): Promise<HomeTestimonial[]> {
  const pageSize = params.pageSize ?? HOME_TESTIMONIALS_PAGE_SIZE;
  const supabase = createClient();

  const { data, error } = await supabase.rpc("list_home_testimonials", {
    p_limit: pageSize,
  });

  if (error) {
    throw error;
  }

  const items: HomeTestimonial[] = [];

  for (const row of data ?? []) {
    const sanitized =
      row.comment != null && row.comment.length > 0
        ? sanitizePlainText(row.comment)
        : "";

    if (sanitized.length === 0) {
      continue;
    }

    items.push({
      id: requireField(row.id, "id"),
      productId: requireField(row.product_id, "product_id"),
      productName: requireField(row.product_name, "product_name"),
      productSlug: requireField(row.product_slug, "product_slug"),
      rating: Number(requireField(row.rating, "rating")),
      comment: sanitized,
      createdAt: requireField(row.created_at, "created_at"),
      authorName: requireField(row.author_name, "author_name"),
    });
  }

  return items;
}
