import { beforeEach, describe, expect, it, vi } from "vitest";

const uploaded = {
  path: "products/new-id.webp",
  publicUrl:
    "https://example.supabase.co/storage/v1/object/public/product-images/products/new-id.webp",
};

const previousUrl =
  "https://example.supabase.co/storage/v1/object/public/product-images/products/old-id.webp";

const uploadProductImage = vi.fn();
const deleteProductImage = vi.fn();

vi.mock("./uploadProductImage", () => ({
  uploadProductImage: (...args: unknown[]) => uploadProductImage(...args),
}));

vi.mock("./deleteProductImage", () => ({
  deleteProductImage: (...args: unknown[]) => deleteProductImage(...args),
}));

import { withReplacedProductImage } from "./withReplacedProductImage";

const file = new File(["x"], "oud.webp", { type: "image/webp" });

describe("withReplacedProductImage", () => {
  beforeEach(() => {
    uploadProductImage.mockReset();
    deleteProductImage.mockReset();
    uploadProductImage.mockResolvedValue(uploaded);
    deleteProductImage.mockResolvedValue(undefined);
  });

  it("deletes the previous object after a successful write", async () => {
    const result = await withReplacedProductImage(
      file,
      previousUrl,
      async (image) => {
        expect(image).toEqual(uploaded);
        return "updated";
      },
    );

    expect(result).toBe("updated");
    expect(deleteProductImage).toHaveBeenCalledWith("products/old-id.webp");
    expect(deleteProductImage).not.toHaveBeenCalledWith(uploaded.path);
  });

  it("deletes the new object and keeps the previous one when run throws", async () => {
    await expect(
      withReplacedProductImage(file, previousUrl, async () => {
        throw new Error("PRODUCT_UPDATE_FAILED");
      }),
    ).rejects.toThrow("PRODUCT_UPDATE_FAILED");

    expect(deleteProductImage).toHaveBeenCalledWith(uploaded.path);
    expect(deleteProductImage).not.toHaveBeenCalledWith("products/old-id.webp");
  });

  it("does not delete when the previous URL is not a bucket object", async () => {
    await withReplacedProductImage(
      file,
      "https://cdn.example/oud.webp",
      async () => "updated",
    );

    expect(deleteProductImage).not.toHaveBeenCalled();
  });
});
