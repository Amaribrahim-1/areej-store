import type { ProductVariant } from "../types";

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
