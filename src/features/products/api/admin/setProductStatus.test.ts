import { beforeEach, describe, expect, it, vi } from "vitest";

const singleMock = vi.fn();
const selectMock = vi.fn(() => ({ single: singleMock }));
const eqMock = vi.fn(() => ({ select: selectMock }));
const updateMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ update: updateMock }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: fromMock,
  }),
}));

import { setProductStatus } from "./setProductStatus";

const productId = "11111111-2222-4333-8444-555555555555";

describe("setProductStatus", () => {
  beforeEach(() => {
    singleMock.mockReset();
    selectMock.mockClear();
    eqMock.mockClear();
    updateMock.mockClear();
    fromMock.mockClear();
  });

  it("updates the product status and returns it", async () => {
    singleMock.mockResolvedValue({ data: { status: "inactive" }, error: null });

    await expect(setProductStatus(productId, "inactive")).resolves.toBe(
      "inactive",
    );

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(updateMock).toHaveBeenCalledWith({ status: "inactive" });
    expect(eqMock).toHaveBeenCalledWith("id", productId);
    expect(selectMock).toHaveBeenCalledWith("status");
  });

  it("maps a missing/forbidden row to PRODUCT_NOT_FOUND", async () => {
    singleMock.mockResolvedValue({
      data: null,
      error: { code: "PGRST116", message: "no rows returned" },
    });

    await expect(setProductStatus(productId, "active")).rejects.toThrow(
      "PRODUCT_NOT_FOUND",
    );
  });

  it("rethrows any other error as-is", async () => {
    const dbError = { code: "500", message: "unexpected" };
    singleMock.mockResolvedValue({ data: null, error: dbError });

    await expect(setProductStatus(productId, "active")).rejects.toBe(dbError);
  });
});
