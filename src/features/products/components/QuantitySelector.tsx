"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
  id?: string;
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  className,
  id,
}: QuantitySelectorProps) {
  const atMin = value <= min;

  function decrease() {
    if (atMin) return;
    onChange(value - 1);
  }

  function increase() {
    onChange(value + 1);
  }

  return (
    <div
      className={cn(
        "inline-flex h-11 items-center rounded-4xl border border-border bg-background",
        className,
      )}
      role="group"
      aria-label="الكمية"
    >
      <span
        className="border-e border-border px-3 text-sm font-medium text-muted-foreground"
        aria-hidden
      >
        الكمية
      </span>
      <div className="inline-flex items-center gap-0.5 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={decrease}
          disabled={atMin}
          aria-label="تقليل الكمية"
          className={cn(
            "rounded-full",
            atMin && "disabled:pointer-events-auto disabled:cursor-not-allowed",
          )}
        >
          <MinusIcon />
        </Button>
        <output
          id={id}
          aria-live="polite"
          className="min-w-10 text-center text-base font-medium tabular-nums text-foreground"
        >
          {value}
        </output>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={increase}
          aria-label="زيادة الكمية"
          className="rounded-full"
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
