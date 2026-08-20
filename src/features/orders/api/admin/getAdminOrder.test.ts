import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingleMock = vi.fn();
const rpcMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: rpcMock,
  }),
}));

import { getAdminOrder } from "./getAdminOrder";

const orderId = "11111111-2222-4333-8444-555555555555";
const lineId = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";

const validRow = {
  id: orderId,
  status: "Pending",
  total: "250.00",
  payment_method: "cod",
  customer_name: "مريم أحمد",
  customer_phone: "01012345678",
  governorate: "Cairo",
  markaz: "Nasr City",
  address_text: "شارع عباس العقاد",
  created_at: "2026-08-20T08:00:00.000Z",
  items: [
    {
      id: lineId,
      product_name: "مسك أبيض",
      variant_label: "30ml",
      quantity: 2,
      unit_price: "125.00",
      line_total: "250.00",
    },
  ],
};

describe("getAdminOrder", () => {
  beforeEach(() => {
    rpcMock.mockClear();
    maybeSingleMock.mockReset();
  });

  it("returns null for a malformed id without calling the RPC", async () => {
    await expect(getAdminOrder("not-a-uuid")).resolves.toBeNull();
    await expect(getAdminOrder("")).resolves.toBeNull();
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("returns null when the order does not exist", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    await expect(getAdminOrder(orderId)).resolves.toBeNull();
    expect(rpcMock).toHaveBeenCalledWith("get_admin_order", {
      p_order_id: orderId,
    });
  });

  it("maps a snapshot row and line items to camelCase", async () => {
    maybeSingleMock.mockResolvedValue({ data: validRow, error: null });

    await expect(getAdminOrder(orderId)).resolves.toEqual({
      id: orderId,
      status: "Pending",
      total: 250,
      paymentMethod: "cod",
      customerName: "مريم أحمد",
      customerPhone: "01012345678",
      governorate: "Cairo",
      markaz: "Nasr City",
      addressText: "شارع عباس العقاد",
      createdAt: "2026-08-20T08:00:00.000Z",
      items: [
        {
          id: lineId,
          productName: "مسك أبيض",
          variantLabel: "30ml",
          quantity: 2,
          unitPrice: 125,
          lineTotal: 250,
        },
      ],
    });
  });

  it("throws NOT_ADMIN when the RPC rejects a non-admin session", async () => {
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: { message: "NOT_ADMIN" },
    });

    await expect(getAdminOrder(orderId)).rejects.toThrow("NOT_ADMIN");
  });
});
