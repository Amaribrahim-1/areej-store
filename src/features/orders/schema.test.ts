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

  it("rejects an empty items array", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      items: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "items")).toBe(
        true,
      );
    }
  });

  it("rejects a non-positive quantity", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      items: [{ variantId: validVariantId, quantity: 0 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.path[0] === "items" && issue.path[2] === "quantity",
        ),
      ).toBe(true);
    }
  });

  it("rejects a non-uuid variantId", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      items: [{ variantId: "not-a-uuid", quantity: 1 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.path[0] === "items" && issue.path[2] === "variantId",
        ),
      ).toBe(true);
    }
  });

  it("rejects an invalid Egyptian phone number", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      phone: "0212345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "phone")).toBe(
        true,
      );
    }
  });

  it("rejects a markaz that does not belong to the governorate", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      governorate: "Cairo",
      markaz: "Kafr El-Sheikh",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "markaz")).toBe(
        true,
      );
    }
  });

  it("rejects a too-short address", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutBase,
      addressText: "قصير",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === "addressText"),
      ).toBe(true);
    }
  });
});
