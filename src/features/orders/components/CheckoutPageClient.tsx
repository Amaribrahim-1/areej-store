"use client";

import type { MyProfile } from "@/features/auth/api/getMyProfile";
import { useCartLineDetails } from "@/features/cart/api/useCartLineDetails";
import { computeCartSubtotal } from "@/features/cart/lib/computeCartSubtotal";
import { lineKey } from "@/features/cart/lib/lineKey";
import { useCartStore } from "@/features/cart/store";
import type { CartLineItemData } from "@/features/cart/types";

import { DEFAULT_PAYMENT_METHOD } from "../constants";
import CheckoutPage from "./CheckoutPage";

type CheckoutPageClientProps = {
  profile: MyProfile | null;
};

export default function CheckoutPageClient({
  profile,
}: CheckoutPageClientProps) {
  const items = useCartStore((state) => state.items);
  const { data, isError, isPending, refetch } = useCartLineDetails();

  const detailsByKey = new Map(
    (data?.lines ?? []).map((detail) => [
      lineKey(detail.productId, detail.variantId),
      detail,
    ]),
  );

  const lines: CartLineItemData[] = items.flatMap((item) => {
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

  function handleRetry() {
    void refetch();
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
    />
  );
}
