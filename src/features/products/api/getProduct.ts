import { createClient } from "@/lib/supabase/client";
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "../constants";
import type {
  ProductDetail,
  ProductQueryParams,
  ProductVariant,
} from "../types";

/**
 * Storefront single-product API (task 3.3).
 * Lookup by exactly one of slug | id. Active products only.
 * Missing / inactive → null (not a thrown error).
 *
 * Frontend owns feature types + useProduct; call this function from the
 * queryFn only — never supabase.from in components.
 */

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  image_url: string;
  product_variants: VariantRow[] | null;
};

type VariantRow = {
  id: string;
  volume_label: string | null;
  original_price: number;
  current_price: number;
  sort_order: number;
};

function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

function hasSlug(
  params: ProductQueryParams,
): params is { slug: string } {
  return "slug" in params;
}

/**
 * Fetch one storefront product with variants + rating aggregates.
 * Product row and catalog rating run in parallel (same lookup key).
 */
export async function getProduct(
  params: ProductQueryParams,
): Promise<ProductDetail | null> {
  const supabase = createClient();
  const filterColumn = hasSlug(params) ? "slug" : "id";
  const filterValue = hasSlug(params) ? params.slug : params.id;

  const productQuery = supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      category,
      image_url,
      product_variants (
        id,
        volume_label,
        original_price,
        current_price,
        sort_order
      )
    `,
    )
    .eq("status", "active")
    .eq(filterColumn, filterValue)
    .order("sort_order", {
      referencedTable: "product_variants",
      ascending: true,
    })
    .maybeSingle();

  const ratingQuery = supabase
    .from("catalog_products")
    .select("average_rating, review_count")
    .eq("status", "active")
    .eq(filterColumn, filterValue)
    .maybeSingle();

  const [productResult, ratingResult] = await Promise.all([
    productQuery,
    ratingQuery,
  ]);

  if (productResult.error) {
    throw productResult.error;
  }
  if (ratingResult.error) {
    throw ratingResult.error;
  }

  const row = productResult.data as ProductRow | null;
  if (!row) {
    return null;
  }

  if (!isProductCategory(row.category)) {
    throw new Error(`Unexpected product category: ${row.category}`);
  }

  const variants: ProductVariant[] = (row.product_variants ?? []).map(
    (variant) => ({
      id: variant.id,
      volumeLabel: variant.volume_label,
      originalPrice: Number(variant.original_price),
      currentPrice: Number(variant.current_price),
      sortOrder: variant.sort_order,
    }),
  );

  if (variants.length === 0) {
    throw new Error(`Product ${row.id} has no variants`);
  }

  const rating = ratingResult.data;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    category: row.category,
    imageUrl: row.image_url,
    averageRating:
      rating?.average_rating === null || rating?.average_rating === undefined
        ? null
        : Number(rating.average_rating),
    reviewCount: Number(rating?.review_count ?? 0),
    variants,
  };
}
