export const PRODUCT_CATEGORIES = [
  "Perfumes",
  "Musk",
  "Fermentation",
  "Hair Oil",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  Perfumes: "عطور",
  Musk: "مسك",
  Fermentation: "مخمرية",
  "Hair Oil": "زيوت الشعر",
};
