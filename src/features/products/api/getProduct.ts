import {
  createClient,
  type AppSupabaseClient,
} from "@/lib/supabase/client";

import { decodeRouteSlug } from "../lib/decodeRouteSlug";
import type {
  ProductDetail,
  ProductQueryParams,
  ProductVariant,
} from "../types";

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

function hasSlug(
  params: ProductQueryParams,
): params is { slug: string } {
  return "slug" in params;
}

export async function getProduct(
  params: ProductQueryParams,
  supabase: AppSupabaseClient = createClient(),
): Promise<ProductDetail | null> {
  const filterColumn = hasSlug(params) ? "slug" : "id";
  const filterValue = hasSlug(params)
    ? decodeRouteSlug(params.slug)
    : params.id;

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
    .select("average_rating, review_count, category_label")
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
    categoryLabel:
      rating?.category_label === null || rating?.category_label === undefined
        ? row.category
        : rating.category_label,
    imageUrl: row.image_url,
    averageRating:
      rating?.average_rating === null || rating?.average_rating === undefined
        ? null
        : Number(rating.average_rating),
    reviewCount: Number(rating?.review_count ?? 0),
    variants,
  };
}
