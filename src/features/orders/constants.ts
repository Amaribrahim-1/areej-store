export const ORDER_STATUSES = [
  "Pending",
  "Shipping",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** DB / API payment method values. MVP ships COD only. */
export const PAYMENT_METHODS = ["cod"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = "cod";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "الدفع عند الاستلام",
};
