import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { productImagePathFromPublicUrl } from "../../lib/productImagePath";
import { productSchema, type ProductInput } from "../../schema";
import type { CreatedProduct } from "../../types";

export type CreateProductInput = Omit<ProductInput, "image"> & {
  image: string;
};

/**
 * Inserts a product and its variants via `create_admin_product`.
 * Re-validates `productSchema` before the write. Image must already be a
 * public URL in the product-images bucket (upload first).
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<CreatedProduct> {
  if (productImagePathFromPublicUrl(input.image) === null) {
    throw new Error("INVALID_PRODUCT_PAYLOAD");
  }

  const parsed = productSchema.safeParse(input);
  if (!parsed.success || typeof parsed.data.image !== "string") {
    throw new Error("INVALID_PRODUCT_PAYLOAD");
  }

  const name = sanitizePlainText(parsed.data.name);
  const description = sanitizePlainText(parsed.data.description);
  if (name.length === 0 || description.length === 0) {
    throw new Error("INVALID_PRODUCT_PAYLOAD");
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_admin_product", {
    p_name: name,
    p_slug: parsed.data.slug,
    p_description: description,
    p_category: parsed.data.category,
    p_status: parsed.data.status,
    p_image_url: parsed.data.image,
    p_variants: parsed.data.variants.map((variant) => ({
      volume_label: sanitizeVolumeLabel(variant.volumeLabel),
      original_price: variant.originalPrice,
      current_price: variant.currentPrice,
    })),
  });

  if (error) {
    throwCreateProductError(error);
  }

  if (!data) {
    throw new Error("PRODUCT_CREATE_NO_ID");
  }

  return { id: data, slug: parsed.data.slug };
}

function sanitizeVolumeLabel(label: string | null): string | null {
  if (!label) return null;
  const sanitized = sanitizePlainText(label);
  return sanitized.length > 0 ? sanitized : null;
}

function throwCreateProductError(error: {
  code?: string;
  message: string;
}): never {
  if (error.message.includes("NOT_ADMIN")) {
    throw new Error("NOT_ADMIN");
  }
  if (error.message.includes("INVALID_PRODUCT_PAYLOAD")) {
    throw new Error("INVALID_PRODUCT_PAYLOAD");
  }
  if (error.code === "23505") {
    throw new Error("PRODUCT_SLUG_TAKEN");
  }
  if (error.code === "23503") {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  throw error;
}
