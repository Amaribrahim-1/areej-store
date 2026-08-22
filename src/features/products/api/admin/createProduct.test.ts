import { beforeEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: rpcMock,
  }),
}));

import { createProduct } from "./createProduct";

const productId = "11111111-2222-4333-8444-555555555555";
const imageUrl =
  "https://example.supabase.co/storage/v1/object/public/product-images/products/abc.webp";

const validInput = {
  name: "عود كمبودي",
  slug: "oud-cambodi",
  description: "خليط دافئ مناسب للمساء.",
  category: "Perfumes",
  status: "active" as const,
  image: imageUrl,
  variants: [{ volumeLabel: "50ml", originalPrice: 250, currentPrice: 200 }],
};

describe("createProduct", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("rejects invalid payloads before calling the RPC", async () => {
    await expect(
      createProduct({
        ...validInput,
        variants: [],
      }),
    ).rejects.toThrow("INVALID_PRODUCT_PAYLOAD");

    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("rejects a name that sanitizes to empty before calling the RPC", async () => {
    await expect(
      createProduct({
        ...validInput,
        name: "<b></b>",
      }),
    ).rejects.toThrow("INVALID_PRODUCT_PAYLOAD");

    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("rejects an image URL that is not in the product-images bucket", async () => {
    await expect(
      createProduct({
        ...validInput,
        image: "https://cdn.example/oud.webp",
      }),
    ).rejects.toThrow("INVALID_PRODUCT_PAYLOAD");

    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("calls create_admin_product with sanitized text and no File", async () => {
    rpcMock.mockResolvedValue({ data: productId, error: null });

    await expect(
      createProduct({
        ...validInput,
        name: "<b>عود كمبودي</b>",
        description: "<p>خليط دافئ مناسب للمساء.</p>",
      }),
    ).resolves.toEqual({ id: productId, slug: "oud-cambodi" });

    expect(rpcMock).toHaveBeenCalledWith("create_admin_product", {
      p_name: "عود كمبودي",
      p_slug: "oud-cambodi",
      p_description: "خليط دافئ مناسب للمساء.",
      p_category: "Perfumes",
      p_status: "active",
      p_image_url: imageUrl,
      p_variants: [
        { volume_label: "50ml", original_price: 250, current_price: 200 },
      ],
    });
  });

  it("maps a duplicate slug to PRODUCT_SLUG_TAKEN", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { code: "23505", message: "duplicate key" },
    });

    await expect(createProduct(validInput)).rejects.toThrow(
      "PRODUCT_SLUG_TAKEN",
    );
  });

  it("maps a missing category to CATEGORY_NOT_FOUND", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { code: "23503", message: "foreign key" },
    });

    await expect(createProduct(validInput)).rejects.toThrow(
      "CATEGORY_NOT_FOUND",
    );
  });

  it("throws when the RPC returns no product id", async () => {
    rpcMock.mockResolvedValue({ data: null, error: null });

    await expect(createProduct(validInput)).rejects.toThrow(
      "PRODUCT_CREATE_NO_ID",
    );
  });
});
