import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { buttonVariants } from "@/components/ui/button";
import type { MyProfile } from "@/features/auth/api/getMyProfile";
import { cn } from "@/lib/utils";

import {
  DEFAULT_PAYMENT_METHOD,
  type PaymentMethod,
} from "../constants";
import type { CheckoutLineItemData } from "../types";
import CheckoutDeliveryAddress from "./CheckoutDeliveryAddress";
import CheckoutLinesList from "./CheckoutLinesList";
import CheckoutLinesSkeleton from "./CheckoutLinesSkeleton";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";

type CheckoutPageProps = {
  lines: CheckoutLineItemData[];
  subtotal: number;
  total: number;
  profile: MyProfile | null;
  paymentMethod?: PaymentMethod;
  isPending?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export default function CheckoutPage({
  lines,
  subtotal,
  total,
  profile,
  paymentMethod = DEFAULT_PAYMENT_METHOD,
  isPending = false,
  isError = false,
  onRetry,
}: CheckoutPageProps) {
  const hasLines = lines.length > 0;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          تأكيد الطلب
        </h1>
        <p className="text-sm text-muted-foreground">
          راجعي منتجاتك وبيانات التوصيل وطريقة الدفع قبل إتمام الطلب.
        </p>
      </header>

      {isPending ? <CheckoutLinesSkeleton /> : null}

      {!isPending && isError ? <ErrorState onRetry={onRetry} /> : null}

      {!isPending && !isError && !hasLines ? (
        <EmptyState
          icon={<ShoppingCartIcon />}
          title="السلة فارغة"
          description="مفيش منتجات لتأكيدها. ارجعي للسلة أو تصفّحي المتجر."
          action={
            <Link href="/cart" className={cn(buttonVariants())}>
              العودة إلى السلة
            </Link>
          }
        />
      ) : null}

      {!isPending && !isError && hasLines ? (
        <>
          <section
            aria-labelledby="checkout-lines-heading"
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                id="checkout-lines-heading"
                className="font-heading text-lg font-semibold text-foreground"
              >
                المنتجات
              </h2>
              <Link
                href="/cart"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                تعديل السلة
              </Link>
            </div>
            <CheckoutLinesList lines={lines} />
          </section>

          <CheckoutOrderSummary subtotal={subtotal} total={total} />

          <div className="space-y-8 border-t border-border pt-8">
            <CheckoutDeliveryAddress profile={profile} />
            <CheckoutPaymentMethod paymentMethod={paymentMethod} />
          </div>
        </>
      ) : null}
    </div>
  );
}
