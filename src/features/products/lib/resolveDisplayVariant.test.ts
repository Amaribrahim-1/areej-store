import { describe, expect, it } from "vitest";

import { resolveDisplayVariant } from "./resolveDisplayVariant";
import type { ProductVariant } from "../types";

function variant(
  overrides: Partial<ProductVariant> & Pick<ProductVariant, "id">,
): ProductVariant {
  return {
    volumeLabel: "50ml",
    currentPrice: 100,
    originalPrice: 100,
    sortOrder: 0,
    ...overrides,
  };
}

describe("resolveDisplayVariant", () => {
  it("throws when there are no variants", () => {
    expect(() => resolveDisplayVariant([], null)).toThrow(
      /at least one variant/,
    );
  });

  it("returns the first variant when selectedId is null", () => {
    const first = variant({ id: "v1", currentPrice: 80 });
    const second = variant({ id: "v2", currentPrice: 50, sortOrder: 1 });

    expect(resolveDisplayVariant([first, second], null)).toEqual(first);
  });

  it("returns the matching variant when selectedId exists", () => {
    const first = variant({ id: "v1" });
    const selected = variant({
      id: "v2",
      currentPrice: 160,
      originalPrice: 200,
      sortOrder: 1,
    });

    expect(resolveDisplayVariant([first, selected], "v2")).toEqual(selected);
  });

  it("falls back to the first variant when selectedId is missing", () => {
    const first = variant({ id: "v1", currentPrice: 80 });
    const second = variant({ id: "v2", currentPrice: 50, sortOrder: 1 });

    expect(resolveDisplayVariant([first, second], "gone")).toEqual(first);
  });
});
