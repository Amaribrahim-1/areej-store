import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { productImagePathFromPublicUrl } from "../../lib/productImagePath";
import { productSchema, type ProductInput } from "../../schema";

export type ProductWriteInput = Omit<ProductInput, "image"> & {
  image: string;
};

export type PreparedProductWrite = {
  name: string;
  slug: string;
  description: string;
  category: string;
  status: ProductInput["status"];
  imageUrl: string;
  variants: Array<{
    id?: string;
    volumeLabel: string | null;
    originalPrice: number;
    currentPrice: number;
  }>;
};

/**
 * Re-validates `productSchema`, sanitizes text, and requires a
 * product-images public URL. Shared by create and update writes.
 *
 * Re-validation boundary: this runs in the browser immediately before the
 * `create_admin_product`/`update_admin_product` RPC call, not inside the RPC
 * itself. Accepted because only an authenticated admin can call those RPCs
 * and rendered text is React-escaped. Revisit if these RPCs are ever exposed
 * to a wider role, or if rendered admin content stops going through React's
 * default escaping (e.g. a future `dangerouslySetInnerHTML` on product name
 * or description).
 */
export function prepareProductWrite(
  input: ProductWriteInput,
): PreparedProductWrite {
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

  return {
    name,
    slug: parsed.data.slug,
    description,
    category: parsed.data.category,
    status: parsed.data.status,
    imageUrl: parsed.data.image,
    variants: parsed.data.variants.map((variant) => ({
      ...(variant.id ? { id: variant.id } : {}),
      volumeLabel: sanitizeVolumeLabel(variant.volumeLabel),
      originalPrice: variant.originalPrice,
      currentPrice: variant.currentPrice,
    })),
  };
}

export function throwProductWriteError(error: {
  code?: string;
  message: string;
}): never {
  if (error.message.includes("NOT_ADMIN")) {
    throw new Error("NOT_ADMIN");
  }
  if (error.message.includes("INVALID_PRODUCT_PAYLOAD")) {
    throw new Error("INVALID_PRODUCT_PAYLOAD");
  }
  if (error.message.includes("PRODUCT_NOT_FOUND")) {
    throw new Error("PRODUCT_NOT_FOUND");
  }
  if (error.message.includes("VARIANT_IN_USE")) {
    throw new Error("VARIANT_IN_USE");
  }
  if (error.message.includes("VARIANT_NOT_FOUND")) {
    throw new Error("VARIANT_NOT_FOUND");
  }
  if (error.code === "23505") {
    throw new Error("PRODUCT_SLUG_TAKEN");
  }
  if (error.code === "23503") {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  throw error;
}

function sanitizeVolumeLabel(label: string | null): string | null {
  if (!label) return null;
  const sanitized = sanitizePlainText(label);
  return sanitized.length > 0 ? sanitized : null;
}
