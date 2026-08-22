import type { ProductQueryParams, ProductsQueryParams } from "../types";

/**
 * Shared products query keys so admin mutations can invalidate the
 * storefront catalog (and vice versa) without hooks importing each other.
 */
export const productsQueryKey = (params: ProductsQueryParams = {}) =>
  ["products", params] as const;

export const productsQueryKeyRoot = ["products"] as const;

export const productQueryKey = (params: ProductQueryParams) =>
  ["product", params] as const;

export const featuredProductsQueryKey = (pageSize: number) =>
  ["featured-products", { pageSize }] as const;

export const featuredProductsQueryKeyRoot = ["featured-products"] as const;

export const latestProductsQueryKey = (pageSize: number) =>
  ["latest-products", { pageSize }] as const;

export const latestProductsQueryKeyRoot = ["latest-products"] as const;

export const adminProductsQueryKey = () => ["admin-products"] as const;

export const categoriesQueryKey = () => ["product-categories"] as const;
