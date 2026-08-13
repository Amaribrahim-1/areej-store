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

/** DB / API payment method values. MVP ships COD only. */
export const PAYMENT_METHODS = ["cod"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = "cod";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "الدفع عند الاستلام",
};

/** Order history is personal, near-real-time data — shorter than the catalog's 5 min. */
export const MY_ORDERS_STALE_TIME_MS = 2 * 60 * 1000;
