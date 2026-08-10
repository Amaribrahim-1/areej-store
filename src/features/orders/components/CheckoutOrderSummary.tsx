import { formatPrice } from "@/components/shared/PriceTag";
import { cn } from "@/lib/utils";

type CheckoutOrderSummaryProps = {
  subtotal: number;
  total: number;
  className?: string;
};

type SummaryRowProps = {
  label: string;
  amount: number;
  emphasized?: boolean;
};

function SummaryRow({ label, amount, emphasized = false }: SummaryRowProps) {
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

export default function CheckoutOrderSummary({
  subtotal,
  total,
  className,
}: CheckoutOrderSummaryProps) {
  return (
    <section
      aria-labelledby="checkout-summary-heading"
      className={cn("space-y-3 border-t border-border pt-6", className)}
    >
      <h2
        id="checkout-summary-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        ملخص الطلب
      </h2>

      <dl className="space-y-2">
        <SummaryRow label="المجموع الفرعي" amount={subtotal} />
        <SummaryRow label="الإجمالي" amount={total} emphasized />
      </dl>
    </section>
  );
}
