/**
 * Seeded category slugs. The live list comes from `getCategories` —
 * Alaa can add more from the admin product form.
 */
export const PRODUCT_CATEGORIES = [
  "Perfumes",
  "Musk",
  "Fermentation",
  "Hair Oil",
] as const;

/** Category slug stored on `products.category` (FK to `categories.slug`). */
export type ProductCategory = string;

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

/** Categories change when Alaa adds one; catalog can stay a few minutes stale. */
export const CATEGORIES_STALE_TIME_MS = 5 * 60 * 1000;

export const PRODUCT_NAME_MIN_LENGTH = 2;
export const PRODUCT_NAME_MAX_LENGTH = 120;
export const PRODUCT_SLUG_MIN_LENGTH = 2;
export const PRODUCT_SLUG_MAX_LENGTH = 120;
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 2000;
export const PRODUCT_VOLUME_LABEL_MAX_LENGTH = 40;
export const PRODUCT_VOLUME_LABEL_PLACEHOLDER = "50ml — متوسط — كبير";

export const CATEGORY_LABEL_MIN_LENGTH = 2;
export const CATEGORY_LABEL_MAX_LENGTH = 40;
export const CATEGORY_SLUG_MAX_LENGTH = 40;

/** Letters/digits (Arabic or Latin) separated by single hyphens. */
export const PRODUCT_SLUG_PATTERN =
  /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

/** Matches `product_variants.original_price` / `current_price` numeric(10, 2). */
export const PRODUCT_PRICE_MAX = 99_999_999.99;

export const PRODUCT_IMAGE_BUCKET = "product-images";

/** Matches the `product-images` bucket `file_size_limit` from the 1.4 migration. */
export const PRODUCT_IMAGE_MAX_OUTPUT_BYTES = 1_048_576;

/** Reject the original pick before decode so a huge phone dump cannot freeze the tab. */
export const PRODUCT_IMAGE_MAX_INPUT_BYTES = 10 * 1024 * 1024;

export const PRODUCT_IMAGE_MAX_DIMENSION = 1200;

export const PRODUCT_IMAGE_WEBP_QUALITY = 0.82;

export const PRODUCT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type ProductImageMimeType = (typeof PRODUCT_IMAGE_MIME_TYPES)[number];

export function isProductImageMimeType(
  value: string,
): value is ProductImageMimeType {
  return (PRODUCT_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}

export const PRODUCT_IMAGE_ACCEPT = PRODUCT_IMAGE_MIME_TYPES.join(",");
