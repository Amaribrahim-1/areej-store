import type { DefaultValues } from "react-hook-form";

import type { ProductFormValues } from "../schema";
import type { AdminProductDetail } from "../types";

export function toAdminProductFormValues(
  product: AdminProductDetail,
): DefaultValues<ProductFormValues> {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    category: product.category,
    status: product.status,
    image: product.imageUrl,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      volumeLabel: variant.volumeLabel ?? "",
      originalPrice: variant.originalPrice,
      currentPrice: variant.currentPrice,
    })),
  };
}
