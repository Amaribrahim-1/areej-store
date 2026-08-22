import {
  resolveGovernorateLabel,
  resolveMarkazLabel,
} from "@/lib/egypt-locations";

type OrderAddressParts = {
  governorate: string;
  markaz: string;
  addressText: string;
};

/** Arabic snapshot address: governorate – markaz – free-text. */
export function formatOrderAddress(order: OrderAddressParts): string {
  const governorate =
    resolveGovernorateLabel(order.governorate) ?? order.governorate;
  const markaz =
    resolveMarkazLabel(order.governorate, order.markaz) ?? order.markaz;

  return `${governorate} – ${markaz} – ${order.addressText}`;
}
