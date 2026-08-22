import { beforeEach, describe, expect, it, vi } from "vitest";

const uploaded = {
  path: "products/test-id.webp",
  publicUrl: "https://cdn.example/products/test-id.webp",
};

const uploadProductImage = vi.fn();
const deleteProductImage = vi.fn();

vi.mock("./uploadProductImage", () => ({
  uploadProductImage: (...args: unknown[]) => uploadProductImage(...args),
}));

vi.mock("./deleteProductImage", () => ({
  deleteProductImage: (...args: unknown[]) => deleteProductImage(...args),
}));

import { withUploadedProductImage } from "./withUploadedProductImage";

const file = new File(["x"], "oud.webp", { type: "image/webp" });

describe("withUploadedProductImage", () => {
  beforeEach(() => {
    uploadProductImage.mockReset();
    deleteProductImage.mockReset();
    uploadProductImage.mockResolvedValue(uploaded);
    deleteProductImage.mockResolvedValue(undefined);
  });

  it("returns the run result and keeps the file on success", async () => {
    const result = await withUploadedProductImage(file, async (image) => {
      expect(image).toEqual(uploaded);
      return "created";
    });

    expect(result).toBe("created");
    expect(deleteProductImage).not.toHaveBeenCalled();
  });

  it("deletes the uploaded object when run throws", async () => {
    await expect(
      withUploadedProductImage(file, async () => {
        throw new Error("PRODUCT_CREATE_FAILED");
      }),
    ).rejects.toThrow("PRODUCT_CREATE_FAILED");

    expect(deleteProductImage).toHaveBeenCalledWith(uploaded.path);
  });

  it("still throws the original error if orphan delete also fails", async () => {
    deleteProductImage.mockRejectedValue(new Error("IMAGE_DELETE_FAILED"));

    await expect(
      withUploadedProductImage(file, async () => {
        throw new Error("PRODUCT_CREATE_FAILED");
      }),
    ).rejects.toThrow("PRODUCT_CREATE_FAILED");
  });
});
