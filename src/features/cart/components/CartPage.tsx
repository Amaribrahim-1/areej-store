"use client";

import ErrorState from "@/components/shared/ErrorState";

import { computeCartSubtotal } from "../lib/computeCartSubtotal";
import type { CartLineItemData } from "../types";
import CartLinesList from "./CartLinesList";
import CartLinesSkeleton from "./CartLinesSkeleton";
import CartTotals from "./CartTotals";

type CartPageProps = {
  lines: CartLineItemData[];
  isPending?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onQuantityChange: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  onRemove: (productId: string, variantId: string) => void;
};

export default function CartPage({
  lines,
  isPending = false,
  isError = false,
  onRetry,
  onQuantityChange,
  onRemove,
}: CartPageProps) {
  const subtotal = computeCartSubtotal(lines);
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          سلة التسوق
        </h1>
        {!isPending && !isError && lines.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {lines.length} {lines.length === 1 ? "منتج" : "منتجات"}
          </p>
        ) : null}
      </header>

      {isPending ? <CartLinesSkeleton /> : null}

      {!isPending && isError ? <ErrorState onRetry={onRetry} /> : null}

      {!isPending && !isError ? (
        <>
          <CartLinesList
            lines={lines}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
          {lines.length > 0 ? (
            <CartTotals subtotal={subtotal} total={subtotal} />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
