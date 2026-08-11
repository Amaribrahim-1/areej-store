/**
 * Public cart surface for other features (e.g. checkout).
 * Prefer this over deep imports into cart/api or cart/lib.
 */
export { useCartLineDetails } from "./api/useCartLineDetails";
export { computeCartSubtotal } from "./lib/computeCartSubtotal";
export { lineKey } from "./lib/lineKey";
export { useCartStore } from "./store";
export type { CartLineItemData } from "./types";
