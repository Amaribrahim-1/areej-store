import { createClient } from "@/lib/supabase/client";

import { ORDER_STATUSES, type OrderStatus } from "../../constants";
import type { AdminOrder } from "../../types";

type AdminOrderRow = {
  id: string;
  status: string;
  total: number | string;
  customer_name: string;
  customer_phone: string;
  governorate: string;
  markaz: string;
  address_text: string;
  created_at: string;
};

/**
 * Returns every order for the admin list, newest first.
 * Snapshot name/phone/address — not live profile fields.
 * No line items (those belong on the details read).
 * Empty shop → `[]`. Non-admin sessions fail with `NOT_ADMIN`.
 */
export async function getAdminOrders(): Promise<AdminOrder[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("list_admin_orders");

  if (error) {
    throwAdminOrdersError(error);
  }

  return ((data ?? []) as AdminOrderRow[]).map(toAdminOrder);
}

function toAdminOrder(order: AdminOrderRow): AdminOrder {
  const total = Number(order.total);

  if (!Number.isFinite(total)) {
    throw new Error("list_admin_orders returned a non-numeric total");
  }

  return {
    id: order.id,
    status: requireOrderStatus(order.status),
    total,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    governorate: order.governorate,
    markaz: order.markaz,
    addressText: order.address_text,
    createdAt: order.created_at,
  };
}

function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

function requireOrderStatus(value: string): OrderStatus {
  if (!isOrderStatus(value)) {
    throw new Error(`Unexpected order status: ${value}`);
  }
  return value;
}

function throwAdminOrdersError(error: { message: string }): never {
  if (error.message.includes("NOT_ADMIN")) {
    throw new Error("NOT_ADMIN");
  }
  throw error;
}
