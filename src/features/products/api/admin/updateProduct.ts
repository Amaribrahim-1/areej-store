import { createClient } from "@/lib/supabase/client";

import {
  prepareProductWrite,
  throwProductWriteError,
  type ProductWriteInput,
} from "./prepareProductWrite";
import type { UpdatedProduct } from "../../types";

export type UpdateProductInput = ProductWriteInput;

/**
 * Updates a product and diffs its variants via `update_admin_product`.
 * Re-validates `productSchema` before the write. Image must already be a
 * public URL in the product-images bucket.
 */
export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
): Promise<UpdatedProduct> {
  const prepared = prepareProductWrite(input);
  const supabase = createClient();
  const { data, error } = await supabase.rpc("update_admin_product", {
    p_id: productId,
    p_name: prepared.name,
    p_slug: prepared.slug,
    p_description: prepared.description,
    p_category: prepared.category,
    p_status: prepared.status,
    p_image_url: prepared.imageUrl,
    p_variants: prepared.variants.map((variant) => ({
      ...(variant.id ? { id: variant.id } : {}),
      volume_label: variant.volumeLabel,
      original_price: variant.originalPrice,
      current_price: variant.currentPrice,
    })),
  });

  if (error) {
    throwProductWriteError(error);
  }

  if (!data) {
    throw new Error("PRODUCT_UPDATE_NO_ID");
  }

  return {
    id: data,
    slug: prepared.slug,
    imageUrl: prepared.imageUrl,
  };
}
