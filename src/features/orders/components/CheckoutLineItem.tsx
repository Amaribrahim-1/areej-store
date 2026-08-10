"use client";

import Image from "next/image";
import Link from "next/link";

import PriceTag, { formatPrice } from "@/components/shared/PriceTag";
import { cn } from "@/lib/utils";

import type { CheckoutLineItemData } from "../types";

type CheckoutLineItemProps = {
  line: CheckoutLineItemData;
  className?: string;
};

export default function CheckoutLineItem({
  line,
  className,
}: CheckoutLineItemProps) {
  const lineCurrentTotal = line.currentPrice * line.quantity;
  const lineOriginalTotal = line.originalPrice * line.quantity;

  return (
    <article
      className={cn(
        "flex gap-4 border-b border-border py-5 last:border-b-0 sm:gap-5",
        className,
      )}
    >
      <Link
        href={`/products/${line.slug}`}
        className={cn(
          "relative size-20 shrink-0 overflow-hidden rounded-2xl bg-brand-50 sm:size-24",
          "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        )}
      >
        <Image
          src={line.imageUrl}
          alt={`صورة ${line.name}`}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <Link
              href={`/products/${line.slug}`}
              className={cn(
                "font-heading text-base font-semibold text-foreground transition-colors hover:text-text-accent",
                "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              )}
            >
              {line.name}
            </Link>
            {line.volumeLabel ? (
              <p className="text-sm text-muted-foreground">{line.volumeLabel}</p>
            ) : null}
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <p>الكمية: {line.quantity}</p>
              <p className="inline-flex flex-wrap items-baseline gap-x-1.5">
                <span>سعر القطعة</span>
                <span className="tabular-nums text-foreground">
                  {formatPrice(line.currentPrice)}
                </span>
              </p>
            </div>
          </div>

          <PriceTag
            currentPrice={lineCurrentTotal}
            originalPrice={lineOriginalTotal}
            size="md"
            className="shrink-0"
          />
        </div>
      </div>
    </article>
  );
}
