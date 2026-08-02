import { cn } from "@/lib/utils";

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

type PriceTagSize = "sm" | "md" | "lg";

type PriceTagProps = {
  currentPrice: number;
  originalPrice?: number;
  size?: PriceTagSize;
  className?: string;
};

const sizeClasses: Record<PriceTagSize, { current: string; original: string }> =
  {
    sm: { current: "text-sm font-semibold", original: "text-xs" },
    md: { current: "text-base font-semibold", original: "text-sm" },
    lg: { current: "text-xl font-bold", original: "text-base" },
  };

export default function PriceTag({
  currentPrice,
  originalPrice,
  size = "md",
  className,
}: PriceTagProps) {
  const isDiscounted = originalPrice != null && currentPrice < originalPrice;
  const sizes = sizeClasses[size];

  if (!isDiscounted) {
    return (
      <span className={cn(sizes.current, "text-foreground", className)}>
        {formatPrice(currentPrice)}
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-baseline gap-2", className)}
      aria-label={`السعر ${formatPrice(currentPrice)} بدلاً من ${formatPrice(originalPrice)}`}
    >
      <span className={cn(sizes.current, "text-text-accent")} aria-hidden>
        {formatPrice(currentPrice)}
      </span>
      <span
        className={cn(sizes.original, "text-muted-foreground line-through")}
        aria-hidden
      >
        {formatPrice(originalPrice)}
      </span>
    </span>
  );
}
