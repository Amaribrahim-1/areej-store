"use client";

import { toast } from "sonner";

import CartPage from "@/features/cart/components/CartPage";

import { useCartLineDetails } from "../api/useCartLineDetails";
import { useCartPriceDriftNotice } from "../hooks/useCartPriceDriftNotice";
import { lineKey } from "../lib/lineKey";
import { useCartStore } from "../store";
import type { CartLineItemData } from "../types";

export default function CartPageClient() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const syncUnitPriceSnapshots = useCartStore(
    (state) => state.syncUnitPriceSnapshots,
  );

  const { data, isError, isPending, refetch } = useCartLineDetails();
  const showPriceDriftNotice = useCartPriceDriftNotice(
    data,
    items,
    syncUnitPriceSnapshots,
  );

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

  const unresolvedLines = data?.unresolved ?? [];

  // When the query is disabled (empty cart), TanStack keeps isPending true — don't skeleton.
  const showPending = items.length > 0 && isPending;

  function handleQuantityChange(
    productId: string,
    variantId: string,
    quantity: number,
  ) {
    updateQuantity(productId, variantId, quantity);
  }

  function handleRemove(productId: string, variantId: string) {
    removeItem(productId, variantId);
    toast.success("تم حذف المنتج من السلة");
  }

  function handleClear() {
    clear();
    toast.success("تم إفراغ السلة");
  }

  function handleRetry() {
    void refetch();
  }

  return (
    <CartPage
      lines={lines}
      unresolvedLines={unresolvedLines}
      isPending={showPending}
      isError={isError}
      showPriceDriftNotice={showPriceDriftNotice}
      onRetry={handleRetry}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
      onClear={handleClear}
    />
  );
}
