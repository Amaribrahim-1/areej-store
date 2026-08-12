import type { MyProfile } from "@/types/profile";
import type { CartLineItemData } from "@/features/cart/public";

import type { OrderStatus, PaymentMethod } from "./constants";

export type { MyProfile };

export type CheckoutLineItemData = CartLineItemData;

export type CheckoutReviewData = {
  lines: CheckoutLineItemData[];
  subtotal: number;
  total: number;
  profile: MyProfile | null;
  paymentMethod: PaymentMethod;
};

/** One `order_items` row, snapshotted at purchase time. */
export type MyOrderLineItem = {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

/** One order in the authenticated customer's order history, newest first. */
export type MyOrder = {
  id: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: MyOrderLineItem[];
};
