export const ORDER_STATUSES = [
  "Pending",
  "Shipping",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: "قيد المراجعة",
  Shipping: "جاري التوصيل",
  Delivered: "تم التوصيل",
  Cancelled: "ملغي",
};

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export const ADMIN_ORDER_SORTS = ["newest", "oldest", "status"] as const;

export type AdminOrderSort = (typeof ADMIN_ORDER_SORTS)[number];

export const ADMIN_ORDER_SORT_LABELS: Record<AdminOrderSort, string> = {
  newest: "الأحدث",
  oldest: "الأقدم",
  status: "حسب الحالة",
};

export function isAdminOrderSort(value: string): value is AdminOrderSort {
  return (ADMIN_ORDER_SORTS as readonly string[]).includes(value);
}

/** DB / API payment method values. MVP ships COD only. */
export const PAYMENT_METHODS = ["cod"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = "cod";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "الدفع عند الاستلام",
};

/** Customer order history is personal, near-real-time data — shorter than the catalog's 5 min. */
export const CUSTOMER_ORDERS_STALE_TIME_MS = 2 * 60 * 1000;

/** Admin order list is acted on in near-real-time — shorter than the catalog. */
export const ADMIN_ORDERS_STALE_TIME_MS = 30 * 1000;
