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

/**
 * One `order_items` row, snapshotted at purchase time.
 * `imageUrl` / `slug` are live product fields (null if the product is
 * inactive or no longer readable under RLS) — display-only, not the charge.
 */
export type CustomerOrderLineItem = {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
  slug: string | null;
};

/** One order in the authenticated customer's order history, newest first. */
export type CustomerOrder = {
  id: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: CustomerOrderLineItem[];
};
