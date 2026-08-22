import { createClient } from "@/lib/supabase/client";

import { requireProductStatus, type ProductStatus } from "../../constants";

/**
 * Toggles a product's status (active/inactive) as a quick admin action.
 * `products_update_admin` RLS already restricts the write to admins — a
 * non-admin session updates zero rows, which surfaces as `PRODUCT_NOT_FOUND`
 * here since the admin UI never calls this for a product it cannot see.
 */
export async function setProductStatus(
  productId: string,
  status: ProductStatus,
): Promise<ProductStatus> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", productId)
    .select("status")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    throw error;
  }

  return requireProductStatus(data.status);
}
