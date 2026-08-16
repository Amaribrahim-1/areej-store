import { describe, expect, it } from "vitest";

import {
  resolveFeaturedDisplayVariant,
  type FeaturedPriceVariant,
} from "./resolveFeaturedDisplayVariant";

function variant(
  overrides: Partial<FeaturedPriceVariant> & Pick<FeaturedPriceVariant, "id">,
): FeaturedPriceVariant {
  return {
    currentPrice: 100,
    originalPrice: 100,
    sortOrder: 0,
    ...overrides,
  };
}

describe("resolveFeaturedDisplayVariant", () => {
  it("throws when there are no variants", () => {
    expect(() => resolveFeaturedDisplayVariant([])).toThrow(
      /at least one variant/,
    );
  });

  it("returns the only variant", () => {
    const only = variant({ id: "v1", currentPrice: 80, originalPrice: 100 });
    expect(resolveFeaturedDisplayVariant([only])).toEqual(only);
  });

  it("picks the discounted size when the cheapest size is full price", () => {
    const cheapest = variant({
      id: "small",
      currentPrice: 50,
      originalPrice: 50,
      sortOrder: 0,
    });
    const onSale = variant({
      id: "large",
      currentPrice: 160,
      originalPrice: 200,
      sortOrder: 1,
    });

    expect(resolveFeaturedDisplayVariant([cheapest, onSale])).toEqual(onSale);
  });

  it("picks the deeper discount when two sizes are on sale", () => {
    const tenPercent = variant({
      id: "v-10",
      currentPrice: 90,
      originalPrice: 100,
      sortOrder: 0,
    });
    const fiftyPercent = variant({
      id: "v-50",
      currentPrice: 50,
      originalPrice: 100,
      sortOrder: 1,
    });

    expect(resolveFeaturedDisplayVariant([tenPercent, fiftyPercent])).toEqual(
      fiftyPercent,
    );
  });

  it("breaks a ratio tie with the lower sort_order", () => {
    const later = variant({
      id: "later",
      currentPrice: 80,
      originalPrice: 100,
      sortOrder: 2,
    });
    const earlier = variant({
      id: "earlier",
      currentPrice: 80,
      originalPrice: 100,
      sortOrder: 1,
    });

    expect(resolveFeaturedDisplayVariant([later, earlier])).toEqual(earlier);
  });
});
