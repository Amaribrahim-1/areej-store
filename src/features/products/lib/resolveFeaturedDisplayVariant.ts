export type FeaturedPriceVariant = {
  id: string;
  currentPrice: number;
  originalPrice: number;
  sortOrder: number;
};

function discountRatio(variant: FeaturedPriceVariant): number {
  if (variant.originalPrice <= 0) return 0;
  return (variant.originalPrice - variant.currentPrice) / variant.originalPrice;
}

/** Picks the variant Home Featured should show: deepest discount, then sort_order. */
export function resolveFeaturedDisplayVariant(
  variants: FeaturedPriceVariant[],
): FeaturedPriceVariant {
  if (variants.length === 0) {
    throw new Error("resolveFeaturedDisplayVariant requires at least one variant");
  }

  return variants.reduce((best, variant) => {
    const bestRatio = discountRatio(best);
    const nextRatio = discountRatio(variant);
    if (nextRatio !== bestRatio) {
      return nextRatio > bestRatio ? variant : best;
    }
    return variant.sortOrder < best.sortOrder ? variant : best;
  });
}
