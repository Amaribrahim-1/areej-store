import { createClient } from "@/lib/supabase/server";

import type { OrderNotificationPayload } from "./formatOrderNotificationMessage";

export type GetOrderNotificationPayloadResult =
  | { ok: true; order: OrderNotificationPayload }
  | { ok: false; reason: "UNAUTHENTICATED" | "NOT_FOUND" | "LOAD_FAILED" };

/**
 * Loads an order + line items for admin notification.
 * Uses the caller's session; RLS restricts to own orders (or admin).
 */
export async function getOrderNotificationPayload(
  orderId: string,
): Promise<GetOrderNotificationPayloadResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: "UNAUTHENTICATED" };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, customer_name, customer_phone, governorate, markaz, address_text, payment_method, total, created_at",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) {
    console.error("[notify] failed to load order", orderError);
    return { ok: false, reason: "LOAD_FAILED" };
  }

  if (!order) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_name, variant_label, quantity, unit_price, line_total")
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("[notify] failed to load order items", itemsError);
    return { ok: false, reason: "LOAD_FAILED" };
  }

  return {
    ok: true,
    order: {
      orderId: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      governorate: order.governorate,
      markaz: order.markaz,
      addressText: order.address_text,
      paymentMethod: order.payment_method,
      total: Number(order.total),
      createdAt: order.created_at,
      lines: (items ?? []).map((item) => ({
        productName: item.product_name,
        variantLabel: item.variant_label,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        lineTotal: Number(item.line_total),
      })),
    },
  };
}
