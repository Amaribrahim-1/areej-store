import { beforeEach, describe, expect, it, vi } from "vitest";

const removeMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        remove: removeMock,
      }),
    },
  }),
}));

import { deleteProductImage } from "./deleteProductImage";

describe("deleteProductImage", () => {
  beforeEach(() => {
    removeMock.mockReset();
  });

  it("removes the object from the product-images bucket", async () => {
    removeMock.mockResolvedValue({ error: null });

    await deleteProductImage("products/test-id.webp");

    expect(removeMock).toHaveBeenCalledWith(["products/test-id.webp"]);
  });

  it("throws IMAGE_DELETE_FAILED when storage rejects the delete", async () => {
    removeMock.mockResolvedValue({ error: { message: "denied" } });

    await expect(deleteProductImage("products/test-id.webp")).rejects.toThrow(
      "IMAGE_DELETE_FAILED",
    );
  });
});
