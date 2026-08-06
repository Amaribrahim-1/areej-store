import { describe, expect, it } from "vitest";

import { lineKey } from "./lineKey";
import { resolveCartPriceDrift } from "./resolveCartPriceDrift";
import type { CartLine } from "../store";
import type { CartLineDetail } from "../types";

function cartLine(
  overrides: Partial<CartLine> &
    Pick<CartLine, "productId" | "variantId" | "quantity">,
): CartLine {
  return overrides;
}

function detail(
  overrides: Partial<CartLineDetail> &
    Pick<CartLineDetail, "productId" | "variantId" | "currentPrice">,
): CartLineDetail {
  return {
    name: "Test",
    slug: "test",
    imageUrl: "https://example.com/x.webp",
    volumeLabel: null,
    originalPrice: overrides.currentPrice,
    ...overrides,
  };
}

function detailsMap(
  details: CartLineDetail[],
): Map<string, CartLineDetail> {
  return new Map(
    details.map((d) => [lineKey(d.productId, d.variantId), d]),
  );
}

describe("resolveCartPriceDrift", () => {
  it("reports no drift and no updates when snapshot matches live price", () => {
    const items = [
      cartLine({
        productId: "p1",
        variantId: "v1",
        quantity: 1,
        unitPriceSnapshot: 120,
      }),
    ];
    const details = detailsMap([
      detail({ productId: "p1", variantId: "v1", currentPrice: 120 }),
    ]);

    expect(resolveCartPriceDrift(items, details)).toEqual({
      hasDrift: false,
      updates: [],
    });
  });

  it("flags drift and queues a snapshot sync when live price changed", () => {
    const items = [
      cartLine({
        productId: "p1",
        variantId: "v1",
        quantity: 2,
        unitPriceSnapshot: 100,
      }),
    ];
    const details = detailsMap([
      detail({ productId: "p1", variantId: "v1", currentPrice: 85 }),
    ]);

    expect(resolveCartPriceDrift(items, details)).toEqual({
      hasDrift: true,
      updates: [
        {
          productId: "p1",
          variantId: "v1",
          unitPriceSnapshot: 85,
        },
      ],
    });
  });

  it("syncs a missing snapshot silently without flagging drift", () => {
    const items = [
      cartLine({
        productId: "p1",
        variantId: "v1",
        quantity: 1,
      }),
    ];
    const details = detailsMap([
      detail({ productId: "p1", variantId: "v1", currentPrice: 90 }),
    ]);

    expect(resolveCartPriceDrift(items, details)).toEqual({
      hasDrift: false,
      updates: [
        {
          productId: "p1",
          variantId: "v1",
          unitPriceSnapshot: 90,
        },
      ],
    });
  });

  it("skips lines with no matching live detail", () => {
    const items = [
      cartLine({
        productId: "gone",
        variantId: "gone-v",
        quantity: 1,
        unitPriceSnapshot: 50,
      }),
    ];

    expect(resolveCartPriceDrift(items, detailsMap([]))).toEqual({
      hasDrift: false,
      updates: [],
    });
  });
});
