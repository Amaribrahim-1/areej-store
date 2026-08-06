import { describe, expect, it } from "vitest";

import { getCartItemCount } from "./getCartItemCount";
import type { CartLine } from "../store";

function item(
  overrides: Partial<CartLine> & Pick<CartLine, "quantity">,
): CartLine {
  return {
    productId: "p1",
    variantId: "v1",
    ...overrides,
  };
}

describe("getCartItemCount", () => {
  it("returns 0 for an empty cart", () => {
    expect(getCartItemCount([])).toBe(0);
  });

  it("returns the line quantity when there is one line", () => {
    expect(getCartItemCount([item({ quantity: 3 })])).toBe(3);
  });

  it("sums quantities across multiple lines", () => {
    expect(
      getCartItemCount([
        item({ quantity: 2 }),
        item({ productId: "p2", variantId: "v2", quantity: 5 }),
      ]),
    ).toBe(7);
  });
});
