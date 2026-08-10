import { cn } from "@/lib/utils";

import {
  DEFAULT_PAYMENT_METHOD,
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
  const label = PAYMENT_METHOD_LABELS[paymentMethod];

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
      <p className="text-sm text-foreground">
        <span className="text-muted-foreground">المحددة لهذا الطلب: </span>
        <span className="font-medium">{label}</span>
      </p>
    </section>
  );
}
