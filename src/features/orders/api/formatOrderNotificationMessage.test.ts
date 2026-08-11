import { describe, expect, it } from "vitest";

import { formatOrderNotificationMessage } from "./formatOrderNotificationMessage";

describe("formatOrderNotificationMessage", () => {
  it("includes customer, Arabic address, COD label, clear qty and totals", () => {
    const message = formatOrderNotificationMessage({
      orderId: "abcdef12-3456-7890-abcd-ef1234567890",
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
    });

    expect(message).toContain("طلب جديد من متجر أريج");
    expect(message).toContain("سارة");
    expect(message).toContain("01012345678");
    expect(message).toContain("القاهرة");
    expect(message).toContain("أول مدينة نصر");
    expect(message).not.toContain("Cairo");
    expect(message).toContain("الدفع عند الاستلام");
    expect(message).toContain("مسك (50ml) | الكمية: 2 | الإجمالي: 250.00 ج.م");
    expect(message).toContain("الإجمالي: 250.00 ج.م");
    expect(message).toContain("abcdef12");
  });
});
