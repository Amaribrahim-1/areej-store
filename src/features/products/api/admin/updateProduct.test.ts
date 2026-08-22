import { beforeEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: rpcMock,
  }),
}));

import { updateProduct } from "./updateProduct";

const productId = "11111111-2222-4333-8444-555555555555";
const variantId = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const imageUrl =
  "https://example.supabase.co/storage/v1/object/public/product-images/products/abc.webp";

const validInput = {
  name: "عود كمبودي",
  slug: "oud-cambodi",
  description: "خليط دافئ مناسب للمساء.",
  category: "Perfumes",
  status: "active" as const,
  image: imageUrl,
  variants: [
    {
      id: variantId,
      volumeLabel: "50ml",
      originalPrice: 250,
      currentPrice: 200,
    },
  ],
};

describe("updateProduct", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("rejects invalid payloads before calling the RPC", async () => {
    await expect(
      updateProduct(productId, {
        ...validInput,
        variants: [],
      }),
    ).rejects.toThrow("INVALID_PRODUCT_PAYLOAD");

    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("calls update_admin_product with existing variant ids", async () => {
    rpcMock.mockResolvedValue({ data: productId, error: null });

    await expect(
      updateProduct(productId, {
        ...validInput,
        name: "<b>عود كمبودي</b>",
        description: "<p>خليط دافئ مناسب للمساء.</p>",
      }),
    ).resolves.toEqual({
      id: productId,
      slug: "oud-cambodi",
      imageUrl,
    });

    expect(rpcMock).toHaveBeenCalledWith("update_admin_product", {
      p_id: productId,
      p_name: "عود كمبودي",
      p_slug: "oud-cambodi",
      p_description: "خليط دافئ مناسب للمساء.",
      p_category: "Perfumes",
      p_status: "active",
      p_image_url: imageUrl,
      p_variants: [
        {
          id: variantId,
          volume_label: "50ml",
          original_price: 250,
          current_price: 200,
        },
      ],
    });
  });

  it("omits id on new variant rows", async () => {
    rpcMock.mockResolvedValue({ data: productId, error: null });

    await updateProduct(productId, {
      ...validInput,
      variants: [
        { volumeLabel: "100ml", originalPrice: 400, currentPrice: 400 },
      ],
    });

    expect(rpcMock).toHaveBeenCalledWith(
      "update_admin_product",
      expect.objectContaining({
        p_variants: [
          {
            volume_label: "100ml",
            original_price: 400,
            current_price: 400,
          },
        ],
      }),
    );
  });

  it("maps VARIANT_IN_USE when a removed size is on an order", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "VARIANT_IN_USE" },
    });

    await expect(updateProduct(productId, validInput)).rejects.toThrow(
      "VARIANT_IN_USE",
    );
  });

  it("maps a missing product to PRODUCT_NOT_FOUND", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "PRODUCT_NOT_FOUND" },
    });

    await expect(updateProduct(productId, validInput)).rejects.toThrow(
      "PRODUCT_NOT_FOUND",
    );
  });

  it("maps a duplicate slug to PRODUCT_SLUG_TAKEN", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { code: "23505", message: "duplicate key" },
    });

    await expect(updateProduct(productId, validInput)).rejects.toThrow(
      "PRODUCT_SLUG_TAKEN",
    );
  });
});
