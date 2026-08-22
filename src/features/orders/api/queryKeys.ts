/**
 * Shared orders query keys so list/detail/customer caches can be
 * invalidated together without hooks importing each other.
 */
export const customerOrdersQueryKey = () => ["customer-orders"] as const;

export const adminOrdersQueryKey = () => ["admin-orders"] as const;

export const adminOrderQueryKey = (orderId: string) =>
  ["admin-order", orderId] as const;
