"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";

import PriceTag, { formatPrice } from "@/components/shared/PriceTag";
import QuantitySelector from "@/components/shared/QuantitySelector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { CartLineItemData } from "../types";

type CartLineItemProps = {
  line: CartLineItemData;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  className?: string;
};

export default function CartLineItem({
  line,
  onQuantityChange,
  onRemove,
  className,
}: CartLineItemProps) {
  const lineCurrentTotal = line.currentPrice * line.quantity;
  const lineOriginalTotal = line.originalPrice * line.quantity;
  const quantityInputId = `cart-qty-${line.productId}-${line.variantId}`;

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
          "relative size-24 shrink-0 overflow-hidden rounded-2xl bg-brand-50 sm:size-28",
          "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        )}
      >
        <Image
          src={line.imageUrl}
          alt={`صورة ${line.name}`}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
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
            <p className="text-xs text-muted-foreground">
              سعر القطعة {formatPrice(line.currentPrice)}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`حذف ${line.name} من السلة`}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <QuantitySelector
            id={quantityInputId}
            value={line.quantity}
            onChange={onQuantityChange}
            className="sm:min-w-32"
          />

          <PriceTag
            currentPrice={lineCurrentTotal}
            originalPrice={lineOriginalTotal}
            size="md"
            className="self-end sm:self-auto"
          />
        </div>
      </div>
    </article>
  );
}
