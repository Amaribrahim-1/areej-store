import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import {
  PRODUCT_CATEGORIES,
  PRODUCTS_PAGE_SIZE,
  type ProductCategory,
} from "../constants";
import { normalizeArabic } from "../lib/normalizeArabic";
import type {
  ProductListItem,
  ProductSort,
  ProductsListResult,
  ProductsQueryParams,
} from "../types";

type CatalogProductRow = Database["public"]["Views"]["catalog_products"]["Row"];

type NormalizedCatalogParams = {
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort: ProductSort;
  page: number;
  pageSize: number;
};

function normalizeParams(params: ProductsQueryParams): NormalizedCatalogParams {
  return {
    search: params.search?.trim() || undefined,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minRating: params.minRating,
    sort: params.sort ?? "newest",
    page: params.page ?? 1,
    pageSize: params.pageSize ?? PRODUCTS_PAGE_SIZE,
  };
}

function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

function requireCatalogField<T>(
  value: T | null | undefined,
  field: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(`catalog_products row missing required field: ${field}`);
  }
  return value;
}

function mapCatalogRow(row: CatalogProductRow): ProductListItem {
  const category = requireCatalogField(row.category, "category");
  if (!isProductCategory(category)) {
    throw new Error(`Unexpected product category from catalog: ${category}`);
  }

  return {
    id: requireCatalogField(row.id, "id"),
    name: requireCatalogField(row.name, "name"),
    slug: requireCatalogField(row.slug, "slug"),
    description: row.description,
    category,
    imageUrl: requireCatalogField(row.image_url, "image_url"),
    currentPrice: Number(
      requireCatalogField(row.display_current_price, "display_current_price"),
    ),
    originalPrice: Number(
      requireCatalogField(
        row.display_original_price,
        "display_original_price",
      ),
    ),
    averageRating:
      row.average_rating === null || row.average_rating === undefined
        ? null
        : Number(row.average_rating),
    reviewCount: Number(row.review_count ?? 0),
    displayVariantId: requireCatalogField(
      row.display_variant_id,
      "display_variant_id",
    ),
    variantCount: Number(
      requireCatalogField(row.variant_count, "variant_count"),
    ),
  };
}

function sortColumn(sort: ProductSort): {
  column: string;
  ascending: boolean;
  nullsFirst?: boolean;
} {
  switch (sort) {
    case "price-asc":
      return { column: "display_current_price", ascending: true };
    case "price-desc":
      return { column: "display_current_price", ascending: false };
    case "rating-desc":
      return {
        column: "average_rating",
        ascending: false,
        nullsFirst: false,
      };
    case "newest":
      return { column: "created_at", ascending: false };
  }
}

export async function getProducts(
  params: ProductsQueryParams = {},
): Promise<ProductsListResult> {
  const normalized = normalizeParams(params);
  const supabase = createClient();
  const { column, ascending, nullsFirst } = sortColumn(normalized.sort);

  let query = supabase
    .from("catalog_products")
    .select("*", { count: "exact" })
    .eq("status", "active");

  if (normalized.search) {
    const searchNormalized = normalizeArabic(normalized.search);
    if (searchNormalized) {
      query = query.ilike("name_normalized", `%${searchNormalized}%`);
    }
  }
  if (normalized.category) {
    query = query.eq("category", normalized.category);
  }
  if (normalized.minPrice !== undefined) {
    query = query.gte("display_current_price", normalized.minPrice);
  }
  if (normalized.maxPrice !== undefined) {
    query = query.lte("display_current_price", normalized.maxPrice);
  }
  if (normalized.minRating !== undefined) {
    query = query.gte("average_rating", normalized.minRating);
  }

  query = query.order(column, { ascending, nullsFirst });

  const from = (normalized.page - 1) * normalized.pageSize;
  const to = from + normalized.pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw error;
  }

  return {
    items: (data ?? []).map(mapCatalogRow),
    total: count ?? 0,
  };
}
