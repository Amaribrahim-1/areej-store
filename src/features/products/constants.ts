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

/** Default page size for the storefront catalog grid. */
export const PRODUCTS_PAGE_SIZE = 12;

/** Catalog changes rarely — tolerate a few minutes of cache. */
export const PRODUCTS_STALE_TIME_MS = 5 * 60 * 1000;
