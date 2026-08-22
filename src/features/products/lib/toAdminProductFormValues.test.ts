import { describe, expect, it } from "vitest";

import { toAdminProductFormValues } from "./toAdminProductFormValues";
import type { AdminProductDetail } from "../types";

const product: AdminProductDetail = {
  id: "11111111-2222-4333-8444-555555555555",
  name: "مسك أبيض",
  slug: "white-musk",
  description: null,
  category: "Musk",
  categoryLabel: "مسك",
  status: "inactive",
  imageUrl:
    "https://example.supabase.co/storage/v1/object/public/product-images/products/abc.webp",
  variants: [
    {
      id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
      volumeLabel: null,
      originalPrice: 100,
      currentPrice: 80,
      sortOrder: 0,
    },
  ],
};

describe("toAdminProductFormValues", () => {
  it("prefills the shared form including a null description and volume", () => {
    expect(toAdminProductFormValues(product)).toEqual({
      name: "مسك أبيض",
      slug: "white-musk",
      description: "",
      category: "Musk",
      status: "inactive",
      image:
        "https://example.supabase.co/storage/v1/object/public/product-images/products/abc.webp",
      variants: [
        {
          id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
          volumeLabel: "",
          originalPrice: 100,
          currentPrice: 80,
        },
      ],
    });
  });
});
