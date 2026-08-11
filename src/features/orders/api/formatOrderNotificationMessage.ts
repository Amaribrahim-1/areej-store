import {
  GOVERNORATE_LABELS,
  getMarkazByGovernorate,
  isGovernorate,
} from "@/features/auth/data/egypt-locations";

import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "../constants";

export type OrderNotificationLine = {
  productName: string;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderNotificationPayload = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  governorate: string;
  markaz: string;
  addressText: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  lines: OrderNotificationLine[];
};

function formatMoney(amount: number): string {
  return `${amount.toFixed(2)} ج.م`;
}

function formatPaymentMethod(paymentMethod: string): string {
  if (paymentMethod in PAYMENT_METHOD_LABELS) {
    return PAYMENT_METHOD_LABELS[paymentMethod as PaymentMethod];
  }
  return paymentMethod;
}

function resolveGovernorateLabel(governorate: string): string {
  if (isGovernorate(governorate)) return GOVERNORATE_LABELS[governorate];
  return governorate;
}

function resolveMarkazLabel(governorate: string, markaz: string): string {
  const match = getMarkazByGovernorate(governorate).find(
    (option) => option.value === markaz,
  );
  return match?.label ?? markaz;
}

function formatAddress(order: OrderNotificationPayload): string {
  const governorate = resolveGovernorateLabel(order.governorate);
  const markaz = resolveMarkazLabel(order.governorate, order.markaz);
  return `${governorate} – ${markaz} – ${order.addressText}`;
}

function formatLines(lines: OrderNotificationLine[]): string {
  return lines
    .map((line) => {
      const variant = line.variantLabel ? ` (${line.variantLabel})` : "";
      // Avoid "× 1" next to money — RTL WhatsApp readers often misread that as 1 ج.م.
      return `- ${line.productName}${variant} | الكمية: ${line.quantity} | الإجمالي: ${formatMoney(line.lineTotal)}`;
    })
    .join("\n");
}

/** Plain-text body for WhatsApp / email fallback. */
export function formatOrderNotificationMessage(
  order: OrderNotificationPayload,
): string {
  const shortId = order.orderId.slice(0, 8);
  return [
    "طلب جديد من متجر أريج",
    `رقم مختصر: ${shortId}`,
    `العميلة: ${order.customerName}`,
    `الهاتف: ${order.customerPhone}`,
    `العنوان: ${formatAddress(order)}`,
    `الدفع: ${formatPaymentMethod(order.paymentMethod)}`,
    "المنتجات:",
    formatLines(order.lines),
    `الإجمالي: ${formatMoney(order.total)}`,
  ].join("\n");
}
