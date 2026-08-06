"use client";

import Link from "next/link";
import { InfoIcon, ShoppingCartIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { computeCartSubtotal } from "../lib/computeCartSubtotal";
import type { CartLineItemData } from "../types";
import CartLinesList from "./CartLinesList";
import CartLinesSkeleton from "./CartLinesSkeleton";
import CartTotals from "./CartTotals";

type CartPageProps = {
  lines: CartLineItemData[];
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
  isPending = false,
  isError = false,
  showPriceDriftNotice = false,
  onRetry,
  onQuantityChange,
  onRemove,
  onClear,
}: CartPageProps) {
  const subtotal = computeCartSubtotal(lines);
  const hasLines = lines.length > 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            سلة التسوق
          </h1>
          {!isPending && !isError && hasLines ? (
            <p className="text-sm text-muted-foreground">
              {lines.length} {lines.length === 1 ? "منتج" : "منتجات"}
            </p>
          ) : null}
        </div>
        {!isPending && !isError && hasLines ? (
          <Button type="button" variant="outline" size="sm" onClick={onClear}>
            إفراغ السلة
          </Button>
        ) : null}
      </header>

      {isPending ? <CartLinesSkeleton /> : null}

      {!isPending && isError ? <ErrorState onRetry={onRetry} /> : null}

      {!isPending && !isError && !hasLines ? (
        <EmptyState
          icon={<ShoppingCartIcon />}
          title="السلة فارغة"
          description="لم تضيفي أي منتجات بعد. تصفّحي المتجر وأضيفي ما يناسبك."
          action={
            <Link href="/products" className={cn(buttonVariants())}>
              تصفح المنتجات
            </Link>
          }
        />
      ) : null}

      {!isPending && !isError && hasLines ? (
        <>
          {showPriceDriftNotice ? (
            <div
              role="status"
              className="flex gap-3 rounded-2xl border border-border bg-brand-50 px-4 py-3 text-sm text-foreground"
            >
              <InfoIcon
                className="mt-0.5 size-4 shrink-0 text-brand-700"
                aria-hidden
              />
              <p>
                تم تحديث أسعار بعض المنتجات في السلة وفقًا لأحدث سعر متاح.
              </p>
            </div>
          ) : null}
          <CartLinesList
            lines={lines}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
          <CartTotals subtotal={subtotal} total={subtotal} />
        </>
      ) : null}
    </div>
  );
}
