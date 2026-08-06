import { formatPrice } from "@/components/shared/PriceTag";
import { cn } from "@/lib/utils";

type CartTotalsProps = {
  subtotal: number;
  total: number;
  className?: string;
};

type TotalRowProps = {
  label: string;
  amount: number;
  emphasized?: boolean;
};

function TotalRow({ label, amount, emphasized = false }: TotalRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt
        className={cn(
          "text-muted-foreground",
          emphasized ? "text-base font-semibold text-foreground" : "text-sm",
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "tabular-nums",
          emphasized
            ? "font-heading text-lg font-bold text-foreground sm:text-xl"
            : "text-sm font-medium text-foreground",
        )}
      >
        {formatPrice(amount)}
      </dd>
    </div>
  );
}

export default function CartTotals({
  subtotal,
  total,
  className,
}: CartTotalsProps) {
  return (
    <section
      aria-labelledby="cart-totals-heading"
      className={cn("space-y-3 border-t border-border pt-6", className)}
    >
      <h2 id="cart-totals-heading" className="sr-only">
        ملخص السلة
      </h2>

      <dl className="space-y-2">
        <TotalRow label="المجموع الفرعي" amount={subtotal} />
        <TotalRow label="الإجمالي" amount={total} emphasized />
      </dl>
    </section>
  );
}
