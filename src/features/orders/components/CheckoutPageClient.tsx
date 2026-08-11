"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  computeCartSubtotal,
  lineKey,
  useCartLineDetails,
  useCartStore,
} from "@/features/cart/public";
import type { MyProfile } from "@/types/profile";

import { notifyOrderPlaced } from "../api/notifyOrderPlaced";
import { usePlaceOrder } from "../api/usePlaceOrder";
import { DEFAULT_PAYMENT_METHOD } from "../constants";
import type { CheckoutLineItemData } from "../types";
import CheckoutPage from "./CheckoutPage";
import CheckoutSuccess from "./CheckoutSuccess";

type CheckoutPageClientProps = {
  profile: MyProfile | null;
};

function hasCompleteProfile(profile: MyProfile | null): profile is MyProfile & {
  fullName: string;
  phone: string;
  governorate: string;
  markaz: string;
  addressText: string;
} {
  return Boolean(
    profile?.fullName &&
    profile.phone &&
    profile.governorate &&
    profile.markaz &&
    profile.addressText,
  );
}

export default function CheckoutPageClient({
  profile,
}: CheckoutPageClientProps) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const { data, isError, isPending, refetch } = useCartLineDetails();
  const { mutate, isPending: isPlacingOrder } = usePlaceOrder();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const detailsByKey = new Map(
    (data?.lines ?? []).map((detail) => [
      lineKey(detail.productId, detail.variantId),
      detail,
    ]),
  );

  const lines: CheckoutLineItemData[] = items.flatMap((item) => {
    const detail = detailsByKey.get(lineKey(item.productId, item.variantId));
    if (!detail) return [];

    return [
      {
        ...detail,
        quantity: item.quantity,
      },
    ];
  });

  const subtotal = computeCartSubtotal(lines);
  const showPending = items.length > 0 && isPending;
  const canPlaceOrder = hasCompleteProfile(profile) && lines.length > 0;

  function handleRetry() {
    void refetch();
  }

  function handlePlaceOrder() {
    if (!hasCompleteProfile(profile)) {
      toast.error("كمّلي بيانات التوصيل قبل إتمام الطلب");
      return;
    }

    if (lines.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    mutate(
      {
        fullName: profile.fullName,
        phone: profile.phone,
        governorate: profile.governorate,
        markaz: profile.markaz,
        addressText: profile.addressText,
        items: lines.map((line) => ({
          variantId: line.variantId,
          quantity: line.quantity,
        })),
      },
      {
        onSuccess: (result) => {
          clearCart();
          setIsOrderPlaced(true);
          void notifyOrderPlaced(result.orderId);
        },
      },
    );
  }

  if (isOrderPlaced) {
    return <CheckoutSuccess />;
  }

  return (
    <CheckoutPage
      lines={lines}
      subtotal={subtotal}
      total={subtotal}
      profile={profile}
      paymentMethod={DEFAULT_PAYMENT_METHOD}
      isPending={showPending}
      isError={isError}
      onRetry={handleRetry}
      onPlaceOrder={handlePlaceOrder}
      isPlacingOrder={isPlacingOrder}
      canPlaceOrder={canPlaceOrder}
    />
  );
}
