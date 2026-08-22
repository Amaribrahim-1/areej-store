import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingleMock = vi.fn();
const rpcMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: rpcMock,
  }),
}));

import { getAdminProduct } from "./getAdminProduct";

const productId = "11111111-2222-4333-8444-555555555555";
const variantId = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";

const validRow = {
  id: productId,
  name: "مسك أبيض",
  slug: "white-musk",
  description: "مسك ناعم.",
  category: "Musk",
  category_label: "مسك",
  status: "inactive",
  image_url:
    "https://example.supabase.co/storage/v1/object/public/product-images/products/abc.webp",
  variants: [
    {
      id: variantId,
      volume_label: "30ml",
      original_price: "100.00",
      current_price: "80.00",
      sort_order: 0,
    },
  ],
};

describe("getAdminProduct", () => {
  beforeEach(() => {
    rpcMock.mockClear();
    maybeSingleMock.mockReset();
  });

  it("returns null for a malformed id without calling the RPC", async () => {
    await expect(getAdminProduct("not-a-uuid")).resolves.toBeNull();
    await expect(getAdminProduct("")).resolves.toBeNull();
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("returns null when the product does not exist", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    await expect(getAdminProduct(productId)).resolves.toBeNull();
    expect(rpcMock).toHaveBeenCalledWith("get_admin_product", {
      p_product_id: productId,
    });
  });

  it("maps an inactive product and variants to camelCase", async () => {
    maybeSingleMock.mockResolvedValue({ data: validRow, error: null });

    await expect(getAdminProduct(productId)).resolves.toEqual({
      id: productId,
      name: "مسك أبيض",
      slug: "white-musk",
      description: "مسك ناعم.",
      category: "Musk",
      categoryLabel: "مسك",
      status: "inactive",
      imageUrl:
        "https://example.supabase.co/storage/v1/object/public/product-images/products/abc.webp",
      variants: [
        {
          id: variantId,
          volumeLabel: "30ml",
          originalPrice: 100,
          currentPrice: 80,
          sortOrder: 0,
        },
      ],
    });
  });

  it("throws NOT_ADMIN when the RPC rejects a non-admin session", async () => {
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: { message: "NOT_ADMIN" },
    });

    await expect(getAdminProduct(productId)).rejects.toThrow("NOT_ADMIN");
  });
});
