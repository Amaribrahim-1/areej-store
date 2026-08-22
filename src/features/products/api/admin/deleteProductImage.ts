import { createClient } from "@/lib/supabase/client";

import { PRODUCT_IMAGE_BUCKET } from "../../constants";

/**
 * Deletes one object from `product-images`. Used to clean an orphan
 * after a failed product write, or a replaced image.
 */
export async function deleteProductImage(path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error("IMAGE_DELETE_FAILED");
  }
}
