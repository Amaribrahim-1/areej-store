import { createClient } from "@/lib/supabase/client";

import type { OrderStatus, PaymentMethod } from "../constants";
import type { MyOrder } from "../types";

/**
 * Returns the authenticated customer's orders (with line items), newest first.
 * No session → `[]` (not an error) — RLS also scopes rows to `user_id`, this
 * query filters explicitly too so a missing/failed auth check fails closed
 * instead of relying on RLS alone.
 */
export async function getMyOrders(): Promise<MyOrder[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
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
        line_total
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((order) => ({
    id: order.id,
    status: order.status as OrderStatus,
    total: Number(order.total),
    paymentMethod: order.payment_method as PaymentMethod,
    createdAt: order.created_at,
    items: order.order_items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      productName: item.product_name,
      variantLabel: item.variant_label,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      lineTotal: Number(item.line_total),
    })),
  }));
}
