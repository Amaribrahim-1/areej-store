import type { ProductCategory } from "./constants";

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

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
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

export type ProductQueryParams = { slug: string } | { id: string };

export type ProductVariant = {
  id: string;
  volumeLabel: string | null;
  originalPrice: number;
  currentPrice: number;
  sortOrder: number;
};

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
