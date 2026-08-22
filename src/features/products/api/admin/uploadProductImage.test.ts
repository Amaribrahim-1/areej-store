import { beforeEach, describe, expect, it, vi } from "vitest";

const uploadMock = vi.fn();
const getPublicUrlMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: uploadMock,
        getPublicUrl: getPublicUrlMock,
      }),
    },
  }),
}));

vi.mock("../../lib/compressProductImage", () => ({
  prepareProductImage: vi.fn(async (file: File) => file),
}));

vi.mock("../../lib/productImagePath", () => ({
  newProductImagePath: () => "products/test-id.webp",
}));

import { uploadProductImage } from "./uploadProductImage";

const file = new File(["x"], "oud.webp", { type: "image/webp" });

describe("uploadProductImage", () => {
  beforeEach(() => {
    uploadMock.mockReset();
    getPublicUrlMock.mockReset();
  });

  it("uploads the prepared file and returns path + public URL", async () => {
    uploadMock.mockResolvedValue({ error: null });
    getPublicUrlMock.mockReturnValue({
      data: {
        publicUrl:
          "https://example.supabase.co/storage/v1/object/public/product-images/products/test-id.webp",
      },
    });

    await expect(uploadProductImage(file)).resolves.toEqual({
      path: "products/test-id.webp",
      publicUrl:
        "https://example.supabase.co/storage/v1/object/public/product-images/products/test-id.webp",
    });

    expect(uploadMock).toHaveBeenCalledWith(
      "products/test-id.webp",
      file,
      expect.objectContaining({
        contentType: "image/webp",
        upsert: false,
      }),
    );
  });

  it("throws IMAGE_UPLOAD_FAILED when storage rejects the write", async () => {
    uploadMock.mockResolvedValue({ error: { message: "denied" } });

    await expect(uploadProductImage(file)).rejects.toThrow("IMAGE_UPLOAD_FAILED");
  });

  it("reports compressing then uploading progress", async () => {
    uploadMock.mockResolvedValue({ error: null });
    getPublicUrlMock.mockReturnValue({
      data: { publicUrl: "https://cdn.example/x.webp" },
    });
    const onProgress = vi.fn();

    await uploadProductImage(file, { onProgress });

    expect(onProgress).toHaveBeenCalledWith({
      phase: "compressing",
      percent: 0,
    });
    expect(onProgress).toHaveBeenCalledWith({
      phase: "uploading",
      percent: null,
    });
    expect(onProgress).toHaveBeenLastCalledWith({
      phase: "uploading",
      percent: 100,
    });
  });
});
