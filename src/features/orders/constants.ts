export const ORDER_STATUSES = [
  "Pending",
  "Shipping",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
