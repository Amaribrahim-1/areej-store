import { describe, expect, it } from "vitest";

import { decodeRouteSlug } from "./decodeRouteSlug";

describe("decodeRouteSlug", () => {
  it("decodes a percent-encoded Arabic slug", () => {
    expect(
      decodeRouteSlug("%D8%A8%D8%A7%D8%AF%D9%8A-%D8%B3%D8%A8%D9%84%D8%A7%D8%B4"),
    ).toBe("بادي-سبلاش");
  });

  it("leaves an already-decoded slug unchanged", () => {
    expect(decodeRouteSlug("بادي-سبلاش")).toBe("بادي-سبلاش");
    expect(decodeRouteSlug("oud-malaki")).toBe("oud-malaki");
  });

  it("returns the original value when the encoding is invalid", () => {
    expect(decodeRouteSlug("%E0%A4%A")).toBe("%E0%A4%A");
  });
});
