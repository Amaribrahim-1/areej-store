/**
 * Public cart surface for other features (e.g. checkout).
 * Prefer this over deep imports into cart/api or cart/lib.
 */
export { useCartLineDetails } from "./api/useCartLineDetails";
export { useCartPriceDriftNotice } from "./hooks/useCartPriceDriftNotice";
export { computeCartSubtotal } from "./lib/computeCartSubtotal";
export { getCartItemCount } from "./lib/getCartItemCount";
export { lineKey } from "./lib/lineKey";
export { useCartStore } from "./store";
export type { CartLine, CartPriceSnapshotUpdate } from "./store";
export type { CartLineItemData, CartLineLookup } from "./types";
