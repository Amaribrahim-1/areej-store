import type { ProductCategory, ProductStatus } from "./constants";

export type ProductSort = "newest" | "price-asc" | "price-desc" | "rating-desc";

export type ProductsQueryParams = {
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};

export type FeaturedProductsParams = {
  pageSize?: number;
};

export type LatestProductsParams = {
  pageSize?: number;
};

export type ProductCategoryItem = {
  slug: string;
  label: string;
  sortOrder: number;
};

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  categoryLabel: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  averageRating: number | null;
  reviewCount: number;
  /** Variant for card price + add-to-cart. Catalog: cheapest. Featured: deepest discount. */
  displayVariantId: string;
  variantCount: number;
};

export type ProductsListResult = {
  items: ProductListItem[];
  total: number;
};

/**
 * One row in the admin products list. Newest first.
 * Includes inactive products the storefront catalog hides.
 * Display prices are the cheapest variant (same rule as the catalog card).
 */
export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel: string;
  status: ProductStatus;
  currentPrice: number;
  originalPrice: number;
  createdAt: string;
};

export type ProductQueryParams = { slug: string } | { id: string };

export type ProductVariant = {
  id: string;
  volumeLabel: string | null;
  originalPrice: number;
  currentPrice: number;
  sortOrder: number;
};

export type UploadedProductImage = {
  path: string;
  publicUrl: string;
};

/** Result of admin product create after the row and its variants exist. */
export type CreatedProduct = {
  id: string;
  slug: string;
};

export type ProductImageUploadPhase = "compressing" | "uploading";

export type ProductImageUploadProgress = {
  phase: ProductImageUploadPhase;
  /** 0–100. `null` = indeterminate (Storage upload has no byte progress events). */
  percent: number | null;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  categoryLabel: string;
  imageUrl: string;
  averageRating: number | null;
  reviewCount: number;
  variants: ProductVariant[];
};
