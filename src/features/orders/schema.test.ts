import { describe, expect, it } from "vitest";

import { checkoutSchema } from "./schema";

const validVariantId = "3828d7dc-6139-4ee3-b82a-de0d59b29ad3";

const validCheckoutBase = {
  fullName: "مريم أحمد",
  phone: "01012345678",
  governorate: "Cairo",
  markaz: "Nasr City",
  addressText: "شارع عباس العقاد، عمارة 12",
  items: [{ variantId: validVariantId, quantity: 2 }],
};

describe("checkoutSchema", () => {
  it("accepts a valid checkout payload", () => {
    const result = checkoutSchema.safeParse(validCheckoutBase);
    expect(result.success).toBe(true);
  });

  it("strips unknown price/total fields from the parsed shape", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      total: 9999,
      items: [
        {
          variantId: validVariantId,
          quantity: 2,
          unitPrice: 1,
          lineTotal: 2,
        },
      ],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).not.toHaveProperty("total");
    expect(result.data.items[0]).toEqual({
      variantId: validVariantId,
      quantity: 2,
    });
  });

  it.each([
    {
      name: "empty items",
      override: { items: [] },
      path: ["items"] as const,
    },
    {
      name: "non-positive quantity",
      override: { items: [{ variantId: validVariantId, quantity: 0 }] },
      path: ["items", 0, "quantity"] as const,
    },
    {
      name: "non-uuid variantId",
      override: { items: [{ variantId: "not-a-uuid", quantity: 1 }] },
      path: ["items", 0, "variantId"] as const,
    },
    {
      name: "invalid Egyptian phone",
      override: { phone: "0212345678" },
      path: ["phone"] as const,
    },
    {
      name: "markaz not in governorate",
      override: { governorate: "Cairo", markaz: "Kafr El-Sheikh" },
      path: ["markaz"] as const,
    },
    {
      name: "too-short address",
      override: { addressText: "قصير" },
      path: ["addressText"] as const,
    },
  ])("rejects $name", ({ override, path }) => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      ...override,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) =>
          path.every((segment, index) => issue.path[index] === segment),
        ),
      ).toBe(true);
    }
  });
});
