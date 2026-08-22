import { describe, expect, it } from "vitest";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_STATUSES,
} from "./constants";
import { productSchema } from "./schema";

const sampleImage = new File(["x"], "oud.webp", { type: "image/webp" });

const validProduct = {
  name: "عود كمبودي",
  description: "خليط دافئ مناسب للمساء.",
  category: "Perfumes" as const,
  status: "active" as const,
  image: sampleImage,
  variants: [{ volumeLabel: "50ml", originalPrice: 250, currentPrice: 200 }],
};

function issueHasPath(
  issues: { path: PropertyKey[] }[],
  path: readonly PropertyKey[],
) {
  return issues.some((issue) =>
    path.every((segment, index) => issue.path[index] === segment),
  );
}

describe("productSchema", () => {
  it("accepts a valid product with a File image and one sized variant", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("accepts an existing image URL instead of a File", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      image: "https://cdn.example/products/oud.webp",
    });
    expect(result.success).toBe(true);
  });

  it("coerces string prices from form inputs", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      variants: [
        { volumeLabel: "5ml", originalPrice: "100", currentPrice: "80" },
      ],
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.variants[0]).toEqual({
      volumeLabel: "5ml",
      originalPrice: 100,
      currentPrice: 80,
    });
  });

  it("turns blank volume labels into null", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      variants: [{ volumeLabel: "   ", originalPrice: 90, currentPrice: 90 }],
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.variants[0].volumeLabel).toBeNull();
  });

  it("accepts currentPrice equal to originalPrice (no discount)", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      variants: [{ originalPrice: 120, currentPrice: 120 }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts the same variant fields for every category", () => {
    for (const category of PRODUCT_CATEGORIES) {
      const result = productSchema.safeParse({ ...validProduct, category });
      expect(result.success).toBe(true);
    }
  });

  it("accepts each product status", () => {
    for (const status of PRODUCT_STATUSES) {
      const result = productSchema.safeParse({ ...validProduct, status });
      expect(result.success).toBe(true);
    }
  });

  it("strips unknown stock fields from the parsed shape", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      quantityAvailable: 12,
      variants: [
        {
          volumeLabel: "50ml",
          originalPrice: 250,
          currentPrice: 200,
          stock: 3,
        },
      ],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).not.toHaveProperty("quantityAvailable");
    expect(result.data.variants[0]).not.toHaveProperty("stock");
  });

  it.each([
    {
      name: "empty variants",
      override: { variants: [] },
      path: ["variants"] as const,
    },
    {
      name: "missing image",
      override: { image: undefined },
      path: ["image"] as const,
    },
    {
      name: "empty File image",
      override: { image: new File([], "empty.webp") },
      path: ["image"] as const,
    },
    {
      name: "unknown category",
      override: { category: "عطور" },
      path: ["category"] as const,
    },
    {
      name: "unknown status",
      override: { status: "archived" },
      path: ["status"] as const,
    },
    {
      name: "blank name",
      override: { name: "   " },
      path: ["name"] as const,
    },
    {
      name: "blank description",
      override: { description: "   " },
      path: ["description"] as const,
    },
    {
      name: "zero price",
      override: {
        variants: [{ originalPrice: 0, currentPrice: 0 }],
      },
      path: ["variants", 0, "originalPrice"] as const,
    },
    {
      name: "currentPrice above originalPrice",
      override: {
        variants: [{ originalPrice: 80, currentPrice: 100 }],
      },
      path: ["variants", 0, "currentPrice"] as const,
    },
    {
      name: "second variant price inversion",
      override: {
        variants: [
          { originalPrice: 50, currentPrice: 40 },
          { originalPrice: 90, currentPrice: 120 },
        ],
      },
      path: ["variants", 1, "currentPrice"] as const,
    },
    {
      name: "price above numeric(10,2) max",
      override: {
        variants: [
          {
            originalPrice: PRODUCT_PRICE_MAX + 0.01,
            currentPrice: PRODUCT_PRICE_MAX + 0.01,
          },
        ],
      },
      path: ["variants", 0, "originalPrice"] as const,
    },
    {
      name: "name longer than max",
      override: { name: "ع".repeat(PRODUCT_NAME_MAX_LENGTH + 1) },
      path: ["name"] as const,
    },
    {
      name: "description longer than max",
      override: {
        description: "و".repeat(PRODUCT_DESCRIPTION_MAX_LENGTH + 1),
      },
      path: ["description"] as const,
    },
  ])("rejects $name", ({ override, path }) => {
    const result = productSchema.safeParse({
      ...validProduct,
      ...override,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(issueHasPath(result.error.issues, path)).toBe(true);
    }
  });
});
