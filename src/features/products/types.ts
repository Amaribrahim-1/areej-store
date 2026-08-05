import type { ProductCategory } from "./constants";

/**
 * Catalog list query contract (Phase 3.2).
 * UI (3.6/3.7) only fills this object — it does not own server data.
 */
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

/** One row ready for ProductCard / catalog grid. */
export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  imageUrl: string;
  /** Display price = cheapest variant's current_price (tie-break: sort_order). */
  currentPrice: number;
  originalPrice: number;
  /** null when the product has no reviews yet. */
  averageRating: number | null;
  reviewCount: number;
};

export type ProductsListResult = {
  items: ProductListItem[];
  total: number;
};

/** Lookup by exactly one of slug | id (storefront prefers slug). */
export type ProductQueryParams = { slug: string } | { id: string };

export type ProductVariant = {
  id: string;
  volumeLabel: string | null;
  originalPrice: number;
  currentPrice: number;
  sortOrder: number;
};

/** One storefront product with all variants + rating aggregates. */
export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  imageUrl: string;
  averageRating: number | null;
  reviewCount: number;
  variants: ProductVariant[];
};
