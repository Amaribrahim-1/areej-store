import { createClient } from "@/lib/supabase/client";

import { requireProductStatus } from "../../constants";
import type { AdminProductDetail, ProductVariant } from "../../types";

const PRODUCT_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type AdminProductDetailRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  category_label: string;
  status: string;
  image_url: string;
  variants: unknown;
};

/**
 * Returns one product for the admin edit form, including inactive.
 * Unknown or malformed id → `null`. Non-admin sessions fail with `NOT_ADMIN`.
 */
export async function getAdminProduct(
  productId: string,
): Promise<AdminProductDetail | null> {
  const id = productId.trim();

  if (!PRODUCT_ID_RE.test(id)) {
    return null;
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("get_admin_product", { p_product_id: id })
    .maybeSingle();

  if (error) {
    throwAdminProductError(error);
  }

  if (!data) {
    return null;
  }

  return toAdminProductDetail(data as AdminProductDetailRow);
}

function toAdminProductDetail(
  product: AdminProductDetailRow,
): AdminProductDetail {
  const variants = toAdminProductVariants(product.variants);

  if (variants.length === 0) {
    throw new Error(`Product ${product.id} has no variants`);
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    categoryLabel: product.category_label,
    status: requireProductStatus(product.status),
    imageUrl: product.image_url,
    variants,
  };
}

function toAdminProductVariants(value: unknown): ProductVariant[] {
  if (!Array.isArray(value)) {
    throw new Error("get_admin_product returned invalid variants");
  }

  return value.map(toAdminProductVariant);
}

function toAdminProductVariant(value: unknown): ProductVariant {
  if (!isRecord(value)) {
    throw new Error("get_admin_product returned an invalid variant");
  }

  const originalPrice = Number(value.original_price);
  const currentPrice = Number(value.current_price);
  const sortOrder = Number(value.sort_order);

  if (
    typeof value.id !== "string" ||
    (value.volume_label !== null && typeof value.volume_label !== "string") ||
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(currentPrice) ||
    !Number.isInteger(sortOrder)
  ) {
    throw new Error("get_admin_product returned an invalid variant");
  }

  return {
    id: value.id,
    volumeLabel: value.volume_label,
    originalPrice,
    currentPrice,
    sortOrder,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function throwAdminProductError(error: { message: string }): never {
  if (error.message.includes("NOT_ADMIN")) {
    throw new Error("NOT_ADMIN");
  }
  throw error;
}
