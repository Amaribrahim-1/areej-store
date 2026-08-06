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
        "flex h-11 w-full items-center justify-between rounded-4xl border border-border bg-background px-1",
        "sm:inline-flex sm:w-auto sm:min-w-36 sm:justify-center sm:gap-1",
        className,
      )}
      role="group"
      aria-label="الكمية"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={atMin}
        aria-label="تقليل الكمية"
        className={cn(
          "size-9 shrink-0 rounded-full",
          atMin && "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <MinusIcon />
      </Button>

      <output
        id={id}
        aria-live="polite"
        className="min-w-10 flex-1 text-center text-base font-semibold tabular-nums text-foreground sm:flex-none sm:px-2"
      >
        {value}
      </output>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={increase}
        aria-label="زيادة الكمية"
        className="size-9 shrink-0 rounded-full"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
