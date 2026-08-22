import { createClient } from "@/lib/supabase/client";

import type { ProductCategoryItem } from "../types";

/**
 * All product categories, display order.
 * Empty table → `[]`. Used by catalog filters and the admin product form.
 */
export async function getCategories(): Promise<ProductCategoryItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("slug, label, sort_order")
    .order("sort_order", { ascending: true })
    .order("slug", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    slug: row.slug,
    label: row.label,
    sortOrder: row.sort_order,
  }));
}
