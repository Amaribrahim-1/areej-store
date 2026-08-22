import { createClient } from "@/lib/supabase/client";

import {
  prepareProductWrite,
  throwProductWriteError,
  type ProductWriteInput,
} from "./prepareProductWrite";
import type { CreatedProduct } from "../../types";

export type CreateProductInput = ProductWriteInput;

/**
 * Inserts a product and its variants via `create_admin_product`.
 * Re-validates `productSchema` before the write. Image must already be a
 * public URL in the product-images bucket (upload first).
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<CreatedProduct> {
  const prepared = prepareProductWrite(input);
  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_admin_product", {
    p_name: prepared.name,
    p_slug: prepared.slug,
    p_description: prepared.description,
    p_category: prepared.category,
    p_status: prepared.status,
    p_image_url: prepared.imageUrl,
    p_variants: prepared.variants.map((variant) => ({
      volume_label: variant.volumeLabel,
      original_price: variant.originalPrice,
      current_price: variant.currentPrice,
    })),
  });

  if (error) {
    throwProductWriteError(error);
  }

  if (!data) {
    throw new Error("PRODUCT_CREATE_NO_ID");
  }

  return { id: data, slug: prepared.slug };
}
