import { describe, expect, it } from "vitest";

import { computeCartSubtotal } from "./computeCartSubtotal";
import type { CartLineItemData } from "../types";

function line(
  overrides: Partial<CartLineItemData> &
    Pick<CartLineItemData, "currentPrice" | "quantity">,
): CartLineItemData {
  return {
    productId: "p1",
    variantId: "v1",
    name: "Test",
    slug: "test",
    imageUrl: "https://example.com/x.webp",
    volumeLabel: null,
    originalPrice: overrides.currentPrice,
    ...overrides,
  };
}

describe("computeCartSubtotal", () => {
  it("returns 0 for an empty cart", () => {
    expect(computeCartSubtotal([])).toBe(0);
  });

  it("returns price times quantity for a single line", () => {
    expect(computeCartSubtotal([line({ currentPrice: 50, quantity: 2 })])).toBe(
      100,
    );
  });

  it("sums line totals across multiple lines", () => {
    expect(
      computeCartSubtotal([
        line({ currentPrice: 100, quantity: 1 }),
        line({
          productId: "p2",
          variantId: "v2",
          currentPrice: 25,
          quantity: 3,
        }),
      ]),
    ).toBe(175);
  });
});
