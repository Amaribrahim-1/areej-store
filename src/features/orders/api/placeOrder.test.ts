import { beforeEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: rpcMock,
  }),
}));

import { placeOrder } from "./placeOrder";

const validVariantId = "3828d7dc-6139-4ee3-b82a-de0d59b29ad3";

const validInput = {
  fullName: "مريم أحمد",
  phone: "01012345678",
  governorate: "Cairo",
  markaz: "Nasr City",
  addressText: "شارع عباس العقاد، عمارة 12",
  items: [{ variantId: validVariantId, quantity: 2 }],
};

describe("placeOrder", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("rejects invalid checkout payloads before calling the RPC", async () => {
    await expect(
      placeOrder({
        ...validInput,
        items: [],
      }),
    ).rejects.toThrow("INVALID_CHECKOUT_PAYLOAD");

    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("calls place_order with variant/qty only — no client prices or totals", async () => {
    const orderId = "11111111-2222-4333-8444-555555555555";
    rpcMock.mockResolvedValue({ data: orderId, error: null });

    await expect(placeOrder(validInput)).resolves.toEqual({ orderId });

    expect(rpcMock).toHaveBeenCalledTimes(1);
    expect(rpcMock).toHaveBeenCalledWith("place_order", {
      customer_name: validInput.fullName,
      customer_phone: validInput.phone,
      governorate: validInput.governorate,
      markaz: validInput.markaz,
      address_text: validInput.addressText,
      items: [{ variant_id: validVariantId, quantity: 2 }],
    });

    const rpcArgs = rpcMock.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(rpcArgs).not.toHaveProperty("total");
    expect(JSON.stringify(rpcArgs.items)).not.toMatch(/price|total/i);
  });

  it("rethrows RPC errors", async () => {
    const rpcError = new Error("one or more items could not be found");
    rpcMock.mockResolvedValue({ data: null, error: rpcError });

    await expect(placeOrder(validInput)).rejects.toBe(rpcError);
  });

  it("throws when the RPC returns no order id", async () => {
    rpcMock.mockResolvedValue({ data: null, error: null });

    await expect(placeOrder(validInput)).rejects.toThrow("PLACE_ORDER_NO_ID");
  });
});
