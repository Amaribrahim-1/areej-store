export const PRODUCT_CATEGORIES = [
  "Perfumes",
  "Musk",
  "Fermentation",
  "Hair Oil",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
