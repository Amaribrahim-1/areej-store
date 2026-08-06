import type { CartLine } from "../store";

/** Total units in the cart (sum of line quantities) — used by navbar badge. */
export function getCartItemCount(items: CartLine[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
