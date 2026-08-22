import { describe, expect, it } from "vitest";

import {
  newProductImagePath,
  productImagePathFromPublicUrl,
} from "./productImagePath";

describe("newProductImagePath", () => {
  it("puts a uuid webp under products/", () => {
    expect(newProductImagePath()).toMatch(
      /^products\/[0-9a-f-]{36}\.webp$/i,
    );
  });
});

describe("productImagePathFromPublicUrl", () => {
  it("extracts the object path from a public storage URL", () => {
    expect(
      productImagePathFromPublicUrl(
        "https://example.supabase.co/storage/v1/object/public/product-images/products/abc.webp",
      ),
    ).toBe("products/abc.webp");
  });

  it("returns null when the URL is not in this bucket", () => {
    expect(
      productImagePathFromPublicUrl("https://cdn.example/oud.webp"),
    ).toBeNull();
  });

  it("returns null for a path that tries to leave the bucket", () => {
    expect(
      productImagePathFromPublicUrl(
        "https://example.supabase.co/storage/v1/object/public/product-images/../secret",
      ),
    ).toBeNull();
  });
});
