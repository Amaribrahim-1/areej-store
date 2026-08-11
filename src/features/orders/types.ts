import type { MyProfile } from "@/types/profile";
import type { CartLineItemData } from "@/features/cart/public";

import type { PaymentMethod } from "./constants";

export type { MyProfile };

export type CheckoutLineItemData = CartLineItemData;

export type CheckoutReviewData = {
  lines: CheckoutLineItemData[];
  subtotal: number;
  total: number;
  profile: MyProfile | null;
  paymentMethod: PaymentMethod;
};
