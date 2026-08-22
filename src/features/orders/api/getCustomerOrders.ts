import { createClient } from "@/lib/supabase/client";

import { requireOrderStatus, requirePaymentMethod } from "../constants";
import type { CustomerOrder, CustomerOrderLineItem } from "../types";

type CustomerOrderProduct = {
  image_url: string | null;
  slug: string | null;
} | null;

type CustomerOrderItemRow = {
  id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_label: string | null;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
  products: CustomerOrderProduct;
};

type CustomerOrderRow = {
  id: string;
  status: string;
  total: number | string;
  payment_method: string;
  created_at: string;
  order_items: CustomerOrderItemRow[];
};

/**
 * Returns the authenticated customer's orders (with line items), newest first.
 * No session → `[]` (not an error). A `getUser()` failure throws so the UI
 * can show ErrorState instead of an empty list. RLS also scopes rows to
 * `user_id`; this query filters explicitly so a missing session fails closed.
 *
 * Line names/prices are purchase snapshots. Product `image_url` / `slug`
 * are joined live (inactive products are hidden by RLS → null).
 */
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total,
      payment_method,
      created_at,
      order_items (
        id,
        product_id,
        variant_id,
        product_name,
        variant_label,
        quantity,
        unit_price,
        line_total,
        products (
          image_url,
          slug
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .order("id", { referencedTable: "order_items", ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as CustomerOrderRow[]).map(toCustomerOrder);
}

function toCustomerOrder(order: CustomerOrderRow): CustomerOrder {
  return {
    id: order.id,
    status: requireOrderStatus(order.status),
    total: Number(order.total),
    paymentMethod: requirePaymentMethod(order.payment_method),
    createdAt: order.created_at,
    items: order.order_items.map(toCustomerOrderLine),
  };
}

function toCustomerOrderLine(line: CustomerOrderItemRow): CustomerOrderLineItem {
  const product = line.products;

  return {
    id: line.id,
    productId: line.product_id,
    variantId: line.variant_id,
    productName: line.product_name,
    variantLabel: line.variant_label,
    quantity: line.quantity,
    unitPrice: Number(line.unit_price),
    lineTotal: Number(line.line_total),
    imageUrl: product?.image_url ?? null,
    slug: product?.slug ?? null,
  };
}
