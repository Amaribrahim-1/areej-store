import { createClient } from "@/lib/supabase/client";

import {
  requireProductCategory,
  requireProductStatus,
} from "../../constants";
import type { AdminProduct } from "../../types";

type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: string;
  current_price: number | string;
  original_price: number | string;
  created_at: string;
};

/**
 * Returns every product for the admin list, including inactive, newest first.
 * Display prices are the cheapest variant — same rule as the catalog card.
 * Empty catalog → `[]`. Non-admin sessions fail with `NOT_ADMIN`.
 */
export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("list_admin_products");

  if (error) {
    throwAdminProductsError(error);
  }

  return ((data ?? []) as AdminProductRow[]).map(toAdminProduct);
}

function toAdminProduct(product: AdminProductRow): AdminProduct {
  const currentPrice = Number(product.current_price);
  const originalPrice = Number(product.original_price);

  if (!Number.isFinite(currentPrice) || !Number.isFinite(originalPrice)) {
    throw new Error("list_admin_products returned a non-numeric price");
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: requireProductCategory(product.category),
    status: requireProductStatus(product.status),
    currentPrice,
    originalPrice,
    createdAt: product.created_at,
  };
}

function throwAdminProductsError(error: { message: string }): never {
  if (error.message.includes("NOT_ADMIN")) {
    throw new Error("NOT_ADMIN");
  }
  throw error;
}
