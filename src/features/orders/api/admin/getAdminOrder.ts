import { createClient } from "@/lib/supabase/client";

import {
  requireOrderStatus,
  requirePaymentMethod,
} from "../../constants";
import type { AdminOrderDetail, AdminOrderLineItem } from "../../types";

const ORDER_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type AdminOrderDetailRow = {
  id: string;
  status: string;
  total: number | string;
  payment_method: string;
  customer_name: string;
  customer_phone: string;
  governorate: string;
  markaz: string;
  address_text: string;
  created_at: string;
  items: unknown;
};

/**
 * Returns one order for the admin details page, including line items.
 * Snapshot name/phone/address and line names/prices — not live profile
 * or live product fields. Unknown or malformed id → `null`. Non-admin
 * sessions fail with `NOT_ADMIN`.
 */
export async function getAdminOrder(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  const id = orderId.trim();

  if (!ORDER_ID_RE.test(id)) {
    return null;
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("get_admin_order", { p_order_id: id })
    .maybeSingle();

  if (error) {
    throwAdminOrderError(error);
  }

  if (!data) {
    return null;
  }

  return toAdminOrderDetail(data as AdminOrderDetailRow);
}

function toAdminOrderDetail(order: AdminOrderDetailRow): AdminOrderDetail {
  const total = Number(order.total);

  if (!Number.isFinite(total)) {
    throw new Error("get_admin_order returned a non-numeric total");
  }

  return {
    id: order.id,
    status: requireOrderStatus(order.status),
    total,
    paymentMethod: requirePaymentMethod(order.payment_method),
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    governorate: order.governorate,
    markaz: order.markaz,
    addressText: order.address_text,
    createdAt: order.created_at,
    items: toAdminOrderLineItems(order.items),
  };
}

function toAdminOrderLineItems(value: unknown): AdminOrderLineItem[] {
  if (!Array.isArray(value)) {
    throw new Error("get_admin_order returned invalid items");
  }

  return value.map(toAdminOrderLineItem);
}

function toAdminOrderLineItem(value: unknown): AdminOrderLineItem {
  if (!isRecord(value)) {
    throw new Error("get_admin_order returned an invalid line item");
  }

  const unitPrice = Number(value.unit_price);
  const lineTotal = Number(value.line_total);
  const quantity = Number(value.quantity);

  if (
    typeof value.id !== "string" ||
    typeof value.product_name !== "string" ||
    (value.variant_label !== null && typeof value.variant_label !== "string") ||
    !Number.isFinite(unitPrice) ||
    !Number.isFinite(lineTotal) ||
    !Number.isInteger(quantity)
  ) {
    throw new Error("get_admin_order returned an invalid line item");
  }

  return {
    id: value.id,
    productName: value.product_name,
    variantLabel: value.variant_label,
    quantity,
    unitPrice,
    lineTotal,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function throwAdminOrderError(error: { message: string }): never {
  if (error.message.includes("NOT_ADMIN")) {
    throw new Error("NOT_ADMIN");
  }
  throw error;
}
