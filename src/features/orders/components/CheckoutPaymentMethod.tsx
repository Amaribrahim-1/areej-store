import { cn } from "@/lib/utils";

import {
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from "../constants";

type CheckoutPaymentMethodProps = {
  paymentMethod?: PaymentMethod;
  className?: string;
};

export default function CheckoutPaymentMethod({
  paymentMethod = DEFAULT_PAYMENT_METHOD,
  className,
}: CheckoutPaymentMethodProps) {
  return (
    <section
      aria-labelledby="checkout-payment-heading"
      className={cn("space-y-3", className)}
    >
      <h2
        id="checkout-payment-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        طريقة الدفع
      </h2>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">اختاري طريقة الدفع</legend>
        <div className="flex w-full flex-col gap-2">
          {PAYMENT_METHODS.map((method) => {
            const selected = method === paymentMethod;
            const optionId = `checkout-payment-${method}`;

            return (
              <label
                key={method}
                htmlFor={optionId}
                className={cn(
                  "flex w-full items-center gap-3 rounded-4xl border px-4 py-3.5 text-sm sm:py-4",
                  selected
                    ? "border-primary bg-brand-50 text-foreground"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                <input
                  id={optionId}
                  type="radio"
                  name="checkout-payment-method"
                  value={method}
                  checked={selected}
                  // MVP: only COD — keep selected; swappable when more methods exist.
                  onChange={() => {}}
                  className="size-4 shrink-0 accent-primary"
                />
                <span className="font-medium">
                  {PAYMENT_METHOD_LABELS[method]}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
