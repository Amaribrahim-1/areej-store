import type { MyProfile } from "@/features/auth/api/getMyProfile";
import type { CartLineItemData } from "@/features/cart/types";

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
