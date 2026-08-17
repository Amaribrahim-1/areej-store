import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CartLineLookup } from "@/features/cart/public";
import { cn } from "@/lib/utils";

type UnresolvedCartLinesNoticeProps = {
  lines: CartLineLookup[];
  onRemove: (productId: string, variantId: string) => void;
  className?: string;
};

/**
 * Surfaces cart/checkout lines whose product went inactive or whose variant
 * was removed (task 4.3) — `getCartLineDetails` already flags these as
 * `unresolved`, but the cart and checkout pages used to drop them silently.
 * No name/image is available for an unresolved line (the product lookup is
 * exactly what failed), so this shows a generic message per line instead.
 */
export default function UnresolvedCartLinesNotice({
  lines,
  onRemove,
  className,
}: UnresolvedCartLinesNoticeProps) {
  if (lines.length === 0) return null;

  return (
    <ul className={cn("space-y-2", className)} role="list">
      {lines.map((line, index) => (
        <UnresolvedCartLineRow
          key={`${line.productId}:${line.variantId}`}
          line={line}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}

type UnresolvedCartLineRowProps = {
  line: CartLineLookup;
  index: number;
  onRemove: UnresolvedCartLinesNoticeProps["onRemove"];
};

function UnresolvedCartLineRow({
  line,
  index,
  onRemove,
}: UnresolvedCartLineRowProps) {
  function handleRemove() {
    onRemove(line.productId, line.variantId);
  }

  return (
    <li
      role="alert"
      className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground"
    >
      <span className="inline-flex items-center gap-2">
        <AlertTriangleIcon
          className="size-4 shrink-0 text-destructive"
          aria-hidden
        />
        هذا المنتج لم يعد متاحًا
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={`إزالة منتج غير متاح ${index + 1}`}
        onClick={handleRemove}
      >
        إزالة
      </Button>
    </li>
  );
}
