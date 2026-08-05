import type { ProductVariant } from "../types";

/**
 * Resolve which variant drives the displayed price on product details.
 * Falls back to the first variant (by sort_order from the API) when the
 * selected id is missing or unknown.
 */
export function resolveDisplayVariant(
  variants: ProductVariant[],
  selectedId: string | null,
): ProductVariant {
  if (variants.length === 0) {
    throw new Error("resolveDisplayVariant requires at least one variant");
  }

  if (selectedId === null) {
    return variants[0];
  }

  return variants.find((variant) => variant.id === selectedId) ?? variants[0];
}
