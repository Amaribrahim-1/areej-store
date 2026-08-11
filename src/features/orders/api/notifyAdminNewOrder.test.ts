import { beforeEach, describe, expect, it, vi } from "vitest";

const getOrderNotificationPayloadMock = vi.fn();
const sendOrderWhatsAppMock = vi.fn();
const sendOrderEmailMock = vi.fn();

vi.mock("./getOrderNotificationPayload", () => ({
  getOrderNotificationPayload: (...args: unknown[]) =>
    getOrderNotificationPayloadMock(...args),
}));

vi.mock("./sendOrderWhatsApp", () => ({
  sendOrderWhatsApp: (...args: unknown[]) => sendOrderWhatsAppMock(...args),
}));

vi.mock("./sendOrderEmail", () => ({
  sendOrderEmail: (...args: unknown[]) => sendOrderEmailMock(...args),
}));

import { notifyAdminNewOrder } from "./notifyAdminNewOrder";

const orderId = "abcdef12-3456-7890-abcd-ef1234567890";

const loadedOrder = {
  orderId,
  customerName: "سارة",
  customerPhone: "01012345678",
  governorate: "Cairo",
  markaz: "Nasr City",
  addressText: "شارع عباس",
  paymentMethod: "cod",
  total: 250,
  createdAt: "2026-08-11T00:00:00Z",
  lines: [
    {
      productName: "مسك",
      variantLabel: "50ml",
      quantity: 2,
      unitPrice: 125,
      lineTotal: 250,
    },
  ],
};

describe("notifyAdminNewOrder", () => {
  beforeEach(() => {
    getOrderNotificationPayloadMock.mockReset();
    sendOrderWhatsAppMock.mockReset();
    sendOrderEmailMock.mockReset();
  });

  it("returns load failure without attempting delivery", async () => {
    getOrderNotificationPayloadMock.mockResolvedValue({
      ok: false,
      reason: "NOT_FOUND",
    });

    await expect(notifyAdminNewOrder(orderId)).resolves.toEqual({
      ok: false,
      reason: "NOT_FOUND",
    });

    expect(sendOrderWhatsAppMock).not.toHaveBeenCalled();
    expect(sendOrderEmailMock).not.toHaveBeenCalled();
  });

  it("uses WhatsApp when delivery succeeds", async () => {
    getOrderNotificationPayloadMock.mockResolvedValue({
      ok: true,
      order: loadedOrder,
    });
    sendOrderWhatsAppMock.mockResolvedValue(undefined);

    await expect(notifyAdminNewOrder(orderId)).resolves.toEqual({
      ok: true,
      channel: "whatsapp",
    });

    expect(sendOrderWhatsAppMock).toHaveBeenCalledTimes(1);
    expect(sendOrderEmailMock).not.toHaveBeenCalled();
  });

  it("falls back to email when WhatsApp fails", async () => {
    getOrderNotificationPayloadMock.mockResolvedValue({
      ok: true,
      order: loadedOrder,
    });
    sendOrderWhatsAppMock.mockRejectedValue(new Error("CALLMEBOT_HTTP_500"));
    sendOrderEmailMock.mockResolvedValue(undefined);

    await expect(notifyAdminNewOrder(orderId)).resolves.toEqual({
      ok: true,
      channel: "email",
    });

    expect(sendOrderEmailMock).toHaveBeenCalledTimes(1);
  });

  it("returns channel none when WhatsApp and email both fail", async () => {
    getOrderNotificationPayloadMock.mockResolvedValue({
      ok: true,
      order: loadedOrder,
    });
    sendOrderWhatsAppMock.mockRejectedValue(new Error("CALLMEBOT_ENV_MISSING"));
    sendOrderEmailMock.mockRejectedValue(new Error("RESEND_ENV_MISSING"));

    await expect(notifyAdminNewOrder(orderId)).resolves.toEqual({
      ok: true,
      channel: "none",
    });
  });
});
