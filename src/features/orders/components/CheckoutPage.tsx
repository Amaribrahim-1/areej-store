import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import PriceDriftNotice from "@/components/shared/PriceDriftNotice";
import UnresolvedCartLinesNotice from "@/components/shared/UnresolvedCartLinesNotice";
import { Button, buttonVariants } from "@/components/ui/button";
import type { CartLineLookup } from "@/features/cart/public";
import { cn } from "@/lib/utils";
import type { MyProfile } from "@/types/profile";

import { DEFAULT_PAYMENT_METHOD, type PaymentMethod } from "../constants";
import type { CheckoutLineItemData } from "../types";
import CheckoutDeliveryAddress from "./CheckoutDeliveryAddress";
import CheckoutLinesList from "./CheckoutLinesList";
import CheckoutLinesSkeleton from "./CheckoutLinesSkeleton";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";

type CheckoutPageProps = {
  lines: CheckoutLineItemData[];
  unresolvedLines?: CartLineLookup[];
  subtotal: number;
  total: number;
  profile: MyProfile | null;
  paymentMethod?: PaymentMethod;
  isPending?: boolean;
  isError?: boolean;
  showPriceDriftNotice?: boolean;
  onRetry?: () => void;
  onRemoveUnresolved?: (productId: string, variantId: string) => void;
  onPlaceOrder: () => void;
  isPlacingOrder?: boolean;
  canPlaceOrder?: boolean;
};

export default function CheckoutPage({
  lines,
  unresolvedLines = [],
  subtotal,
  total,
  profile,
  paymentMethod = DEFAULT_PAYMENT_METHOD,
  isPending = false,
  isError = false,
  showPriceDriftNotice = false,
  onRetry,
  onRemoveUnresolved,
  onPlaceOrder,
  isPlacingOrder = false,
  canPlaceOrder = false,
}: CheckoutPageProps) {
  const hasResolvedLines = lines.length > 0;
  const hasAnyLines = hasResolvedLines || unresolvedLines.length > 0;
  const isSubmitDisabled = isPlacingOrder || !canPlaceOrder;

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

      {!isPending && !isError && !hasAnyLines ? (
        <EmptyState
          icon={<ShoppingCartIcon />}
          title="السلة فارغة"
          description="مفيش منتجات لتأكيدها. ارجعي للسلة أو تصفّحي المتجر."
          action={
            <Button render={<Link href="/cart" />}>العودة إلى السلة</Button>
          }
        />
      ) : null}

      {!isPending && !isError && hasAnyLines ? (
        <>
          {showPriceDriftNotice ? <PriceDriftNotice /> : null}

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
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                تعديل السلة
              </Link>
            </div>

            {onRemoveUnresolved ? (
              <UnresolvedCartLinesNotice
                lines={unresolvedLines}
                onRemove={onRemoveUnresolved}
              />
            ) : null}

            {hasResolvedLines ? <CheckoutLinesList lines={lines} /> : null}
          </section>

          {hasResolvedLines ? (
            <>
              <CheckoutOrderSummary subtotal={subtotal} total={total} />

              <div className="space-y-8 border-t border-border pt-8">
                <CheckoutDeliveryAddress profile={profile} />
                <CheckoutPaymentMethod paymentMethod={paymentMethod} />
              </div>

              <Button
                type="button"
                className="w-full"
                size="lg"
                disabled={isSubmitDisabled}
                aria-busy={isPlacingOrder}
                onClick={onPlaceOrder}
              >
                {isPlacingOrder ? "جاري إتمام الطلب..." : "إتمام الطلب"}
              </Button>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
