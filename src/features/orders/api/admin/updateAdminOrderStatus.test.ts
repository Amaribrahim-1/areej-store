import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingleMock = vi.fn();
const selectMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const eqMock = vi.fn(() => ({ select: selectMock }));
const updateMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ update: updateMock }));
const getUserMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser: getUserMock },
    from: fromMock,
  }),
}));

import { updateAdminOrderStatus } from "./updateAdminOrderStatus";

const orderId = "11111111-2222-4333-8444-555555555555";
const validInput = { orderId, status: "Shipping" as const };

describe("updateAdminOrderStatus", () => {
  beforeEach(() => {
    maybeSingleMock.mockReset();
    selectMock.mockClear();
    eqMock.mockClear();
    updateMock.mockClear();
    fromMock.mockClear();
    getUserMock.mockReset();
  });

  it("rejects an invalid payload before calling Supabase", async () => {
    await expect(
      updateAdminOrderStatus({
        orderId: "not-a-uuid",
        status: "Shipping",
      }),
    ).rejects.toThrow("INVALID_ORDER_STATUS_PAYLOAD");

    expect(getUserMock).not.toHaveBeenCalled();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("rejects a status that is not in ORDER_STATUSES", async () => {
    await expect(
      updateAdminOrderStatus({
        orderId,
        status: "pending" as never,
      }),
    ).rejects.toThrow("INVALID_ORDER_STATUS_PAYLOAD");

    expect(fromMock).not.toHaveBeenCalled();
  });

  it("throws UNAUTHENTICATED when there is no session", async () => {
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(updateAdminOrderStatus(validInput)).rejects.toThrow(
      "UNAUTHENTICATED",
    );
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("updates only status and returns the written value", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { id: "admin-user" } },
      error: null,
    });
    maybeSingleMock.mockResolvedValue({
      data: { status: "Shipping" },
      error: null,
    });

    await expect(updateAdminOrderStatus(validInput)).resolves.toEqual({
      status: "Shipping",
    });

    expect(fromMock).toHaveBeenCalledWith("orders");
    expect(updateMock).toHaveBeenCalledWith({ status: "Shipping" });
    expect(eqMock).toHaveBeenCalledWith("id", orderId);
    expect(selectMock).toHaveBeenCalledWith("status");
  });

  it("throws ORDER_NOT_FOUND when RLS or a missing row returns no data", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { id: "admin-user" } },
      error: null,
    });
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    await expect(updateAdminOrderStatus(validInput)).rejects.toThrow(
      "ORDER_NOT_FOUND",
    );
  });
});
