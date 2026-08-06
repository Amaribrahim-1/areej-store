import type { CartLineItemData } from "../types";

export function computeCartSubtotal(lines: CartLineItemData[]): number {
  return lines.reduce(
    (total, line) => total + line.currentPrice * line.quantity,
    0,
  );
}
