"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import PriceDriftNotice from "@/components/shared/PriceDriftNotice";
import UnresolvedCartLinesNotice from "@/components/shared/UnresolvedCartLinesNotice";
import { Button, buttonVariants } from "@/components/ui/button";
import type { CartLineLookup } from "@/features/cart/public";
import { cn } from "@/lib/utils";

import { computeCartSubtotal } from "../lib/computeCartSubtotal";
import type { CartLineItemData } from "../types";
import CartLinesList from "./CartLinesList";
import CartLinesSkeleton from "./CartLinesSkeleton";
import CartTotals from "./CartTotals";

type CartPageProps = {
  lines: CartLineItemData[];
  unresolvedLines?: CartLineLookup[];
  isPending?: boolean;
  isError?: boolean;
  showPriceDriftNotice?: boolean;
  onRetry?: () => void;
  onQuantityChange: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  onRemove: (productId: string, variantId: string) => void;
  onClear: () => void;
};

export default function CartPage({
  lines,
  unresolvedLines = [],
  isPending = false,
  isError = false,
  showPriceDriftNotice = false,
  onRetry,
  onQuantityChange,
  onRemove,
  onClear,
}: CartPageProps) {
  const subtotal = computeCartSubtotal(lines);
  const hasResolvedLines = lines.length > 0;
  const hasAnyLines = hasResolvedLines || unresolvedLines.length > 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            سلة التسوق
          </h1>
          {!isPending && !isError && hasResolvedLines ? (
            <p className="text-sm text-muted-foreground">
              {lines.length} {lines.length === 1 ? "منتج" : "منتجات"}
            </p>
          ) : null}
        </div>
        {!isPending && !isError && hasAnyLines ? (
          <Button type="button" variant="outline" size="sm" onClick={onClear}>
            إفراغ السلة
          </Button>
        ) : null}
      </header>

      {isPending ? <CartLinesSkeleton /> : null}

      {!isPending && isError ? <ErrorState onRetry={onRetry} /> : null}

      {!isPending && !isError && !hasAnyLines ? (
        <EmptyState
          icon={<ShoppingCartIcon />}
          title="السلة فارغة"
          description="لم تضيفي أي منتجات بعد. تصفّحي المتجر وأضيفي ما يناسبك."
          action={
            <Button render={<Link href="/products" />}>تصفح المنتجات</Button>
          }
        />
      ) : null}

      {!isPending && !isError && hasAnyLines ? (
        <>
          {showPriceDriftNotice ? <PriceDriftNotice /> : null}

          <UnresolvedCartLinesNotice
            lines={unresolvedLines}
            onRemove={onRemove}
          />

          {hasResolvedLines ? (
            <>
              <CartLinesList
                lines={lines}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
              <CartTotals subtotal={subtotal} total={subtotal} />
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  تأكيد الطلب
                </Link>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
