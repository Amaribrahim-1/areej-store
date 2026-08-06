import { createClient } from "@/lib/supabase/client";

import { lineKey } from "../lib/lineKey";
import type {
  CartLineDetail,
  CartLineDetailsResult,
  CartLineLookup,
} from "../types";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  product_variants: VariantRow[] | null;
};

type VariantRow = {
  id: string;
  volume_label: string | null;
  original_price: number | string;
  current_price: number | string;
};

function dedupeLookups(lookups: CartLineLookup[]): CartLineLookup[] {
  const seen = new Set<string>();
  const unique: CartLineLookup[] = [];

  for (const lookup of lookups) {
    const key = lineKey(lookup.productId, lookup.variantId);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(lookup);
  }

  return unique;
}

/**
 * Resolves display fields for cart lines from product + variant IDs.
 * Active products only. Missing / inactive / unknown-variant pairs go to `unresolved`.
 * Result `lines` preserve the order of the (deduped) input lookups.
 */
export async function getCartLineDetails(
  lookups: CartLineLookup[],
): Promise<CartLineDetailsResult> {
  const uniqueLookups = dedupeLookups(lookups);

  if (uniqueLookups.length === 0) {
    return { lines: [], unresolved: [] };
  }

  const productIds = [
    ...new Set(uniqueLookups.map((lookup) => lookup.productId)),
  ];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      image_url,
      product_variants (
        id,
        volume_label,
        original_price,
        current_price
      )
    `,
    )
    .eq("status", "active")
    .in("id", productIds);

  if (error) {
    throw error;
  }

  const productsById = new Map<string, ProductRow>();
  for (const row of (data ?? []) as ProductRow[]) {
    productsById.set(row.id, row);
  }

  const lines: CartLineDetail[] = [];
  const unresolved: CartLineLookup[] = [];

  for (const lookup of uniqueLookups) {
    const product = productsById.get(lookup.productId);
    const variant = product?.product_variants?.find(
      (item) => item.id === lookup.variantId,
    );

    if (!product || !variant) {
      unresolved.push(lookup);
      continue;
    }

    lines.push({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      volumeLabel: variant.volume_label,
      currentPrice: Number(variant.current_price),
      originalPrice: Number(variant.original_price),
    });
  }

  return { lines, unresolved };
}
