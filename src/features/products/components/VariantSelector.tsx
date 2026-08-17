"use client";

import { cn } from "@/lib/utils";

import type { ProductVariant } from "../types";

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
  className?: string;
};

export default function VariantSelector({
  variants,
  selectedId,
  onSelect,
  className,
}: VariantSelectorProps) {
  if (variants.length <= 1) {
    return null;
  }

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="font-heading text-sm font-semibold text-foreground">
        اختاري الحجم
      </legend>
      <div
        role="radiogroup"
        aria-label="حجم المنتج"
        className="flex flex-wrap gap-2"
      >
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          const label = variant.volumeLabel?.trim() || "حجم";

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(variant.id)}
              className={cn(
                "rounded-4xl border px-4 py-2 text-sm font-medium transition-colors outline-none",
                "focus-visible:ring-[3px] focus-visible:ring-ring/50 cursor-pointer",
                selected
                  ? "border-brand bg-brand text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-brand-300 hover:bg-brand-50",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
