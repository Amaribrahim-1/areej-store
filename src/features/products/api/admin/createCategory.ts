import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { categorySchema, type CategoryInput } from "../../schema";
import type { ProductCategoryItem } from "../../types";

/**
 * Inserts a category for the admin product form.
 * Re-validates `categorySchema` and sanitizes the Arabic label before write.
 */
export async function createCategory(
  input: CategoryInput,
): Promise<ProductCategoryItem> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("INVALID_CATEGORY_PAYLOAD");
  }

  const label = sanitizePlainText(parsed.data.label);
  if (label.length === 0) {
    throw new Error("INVALID_CATEGORY_PAYLOAD");
  }

  const supabase = createClient();

  const { data: last, error: lastError } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastError) {
    throw lastError;
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      slug: parsed.data.slug,
      label,
      sort_order: (last?.sort_order ?? 0) + 1,
    })
    .select("slug, label, sort_order")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("CATEGORY_ALREADY_EXISTS");
    }
    throw error;
  }

  return {
    slug: data.slug,
    label: data.label,
    sortOrder: data.sort_order,
  };
}
