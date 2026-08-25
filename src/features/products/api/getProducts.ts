import {
  createClient,
  type AppSupabaseClient,
} from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import {
  HOME_FEATURED_PAGE_SIZE,
  HOME_LATEST_PAGE_SIZE,
  PRODUCTS_PAGE_SIZE,
  type ProductCategory,
} from "../constants";
import { normalizeArabic } from "../lib/normalizeArabic";
import {
  resolveFeaturedDisplayVariant,
  type FeaturedPriceVariant,
} from "../lib/resolveFeaturedDisplayVariant";
import type {
  FeaturedProductsParams,
  LatestProductsParams,
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

function requireCatalogField<T>(
  value: T | null | undefined,
  field: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(`product list row missing required field: ${field}`);
  }
  return value;
}

function mapCatalogRow(row: CatalogProductRow): ProductListItem {
  const category = requireCatalogField(row.category, "category");

  return {
    id: requireCatalogField(row.id, "id"),
    name: requireCatalogField(row.name, "name"),
    slug: requireCatalogField(row.slug, "slug"),
    description: row.description,
    category,
    categoryLabel: requireCatalogField(row.category_label, "category_label"),
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
  supabase: AppSupabaseClient = createClient(),
): Promise<ProductsListResult> {
  const normalized = normalizeParams(params);
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

type FeaturedVariantRow = {
  id: string;
  product_id: string;
  current_price: number;
  original_price: number;
  sort_order: number;
};

function groupFeaturedVariants(
  variantRows: FeaturedVariantRow[],
): Map<string, FeaturedPriceVariant[]> {
  const variantsByProductId = new Map<string, FeaturedPriceVariant[]>();

  for (const row of variantRows) {
    const variants = variantsByProductId.get(row.product_id) ?? [];
    variants.push({
      id: row.id,
      currentPrice: Number(row.current_price),
      originalPrice: Number(row.original_price),
      sortOrder: Number(row.sort_order),
    });
    variantsByProductId.set(row.product_id, variants);
  }

  return variantsByProductId;
}

function applyFeaturedDisplayPrices(
  products: ProductListItem[],
  variantRows: FeaturedVariantRow[],
): ProductListItem[] {
  const variantsByProductId = groupFeaturedVariants(variantRows);

  return products.map((product) => {
    const variants = variantsByProductId.get(product.id);
    if (!variants || variants.length === 0) {
      throw new Error(`featured product missing variants: ${product.id}`);
    }
    const featured = resolveFeaturedDisplayVariant(variants);
    return {
      ...product,
      currentPrice: featured.currentPrice,
      originalPrice: featured.originalPrice,
      displayVariantId: featured.id,
    };
  });
}

export async function getLatestProducts(
  params: LatestProductsParams = {},
  supabase: AppSupabaseClient = createClient(),
): Promise<ProductListItem[]> {
  const pageSize = params.pageSize ?? HOME_LATEST_PAGE_SIZE;

  const { data, error } = await supabase
    .from("catalog_products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(0, pageSize - 1);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapCatalogRow);
}

export async function getFeaturedProducts(
  params: FeaturedProductsParams = {},
  supabase: AppSupabaseClient = createClient(),
): Promise<ProductListItem[]> {
  const pageSize = params.pageSize ?? HOME_FEATURED_PAGE_SIZE;

  const { data, error } = await supabase
    .from("catalog_products")
    .select("*")
    .eq("status", "active")
    .eq("has_discount", true)
    .order("discount_depth", { ascending: false })
    .order("created_at", { ascending: false })
    .range(0, pageSize - 1);

  if (error) {
    throw error;
  }

  const products = (data ?? []).map(mapCatalogRow);
  if (products.length === 0) {
    return [];
  }

  const { data: variantRows, error: variantError } = await supabase
    .from("product_variants")
    .select("id, product_id, current_price, original_price, sort_order")
    .in(
      "product_id",
      products.map((product) => product.id),
    );

  if (variantError) {
    throw variantError;
  }

  return applyFeaturedDisplayPrices(products, variantRows ?? []);
}
