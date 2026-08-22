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

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export function requireProductCategory(value: string): ProductCategory {
  if (!isProductCategory(value)) {
    throw new Error(`Unexpected product category: ${value}`);
  }
  return value;
}

export const PRODUCT_STATUSES = ["active", "inactive"] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: "ظاهر",
  inactive: "غير ظاهر",
};

export function isProductStatus(value: string): value is ProductStatus {
  return (PRODUCT_STATUSES as readonly string[]).includes(value);
}

export function requireProductStatus(value: string): ProductStatus {
  if (!isProductStatus(value)) {
    throw new Error(`Unexpected product status: ${value}`);
  }
  return value;
}

export const PRODUCTS_PAGE_SIZE = 12;
export const HOME_LATEST_PAGE_SIZE = 4;
export const HOME_FEATURED_PAGE_SIZE = 4;

export const PRODUCTS_STALE_TIME_MS = 5 * 60 * 1000;

/** Admin product list is acted on by Alaa — shorter than the public catalog. */
export const ADMIN_PRODUCTS_STALE_TIME_MS = 60 * 1000;
