import { beforeEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: rpcMock,
  }),
}));

import { getAdminProducts } from "./getAdminProducts";

const productId = "11111111-2222-4333-8444-555555555555";

const validRow = {
  id: productId,
  name: "مسك أبيض",
  slug: "white-musk",
  category: "Musk",
  status: "inactive",
  current_price: "80.00",
  original_price: "100.00",
  created_at: "2026-08-22T08:00:00.000Z",
};

describe("getAdminProducts", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("maps rows including inactive products to camelCase", async () => {
    rpcMock.mockResolvedValue({ data: [validRow], error: null });

    await expect(getAdminProducts()).resolves.toEqual([
      {
        id: productId,
        name: "مسك أبيض",
        slug: "white-musk",
        category: "Musk",
        status: "inactive",
        currentPrice: 80,
        originalPrice: 100,
        createdAt: "2026-08-22T08:00:00.000Z",
      },
    ]);
    expect(rpcMock).toHaveBeenCalledWith("list_admin_products");
  });

  it("returns an empty array when the catalog has no products", async () => {
    rpcMock.mockResolvedValue({ data: [], error: null });

    await expect(getAdminProducts()).resolves.toEqual([]);
  });

  it("throws NOT_ADMIN when the RPC rejects a non-admin session", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "NOT_ADMIN" },
    });

    await expect(getAdminProducts()).rejects.toThrow("NOT_ADMIN");
  });
});
