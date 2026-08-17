import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { MyProfile } from "@/types/profile";
import {
  resolveGovernorateLabel,
  resolveMarkazLabel,
} from "@/lib/egypt-locations";
import { cn } from "@/lib/utils";

import { hasCompleteProfile } from "../lib/hasCompleteProfile";

type CheckoutDeliveryAddressProps = {
  profile: MyProfile | null;
  className?: string;
};

export default function CheckoutDeliveryAddress({
  profile,
  className,
}: CheckoutDeliveryAddressProps) {
  const governorateLabel = profile
    ? resolveGovernorateLabel(profile.governorate)
    : null;
  const markazLabel = profile
    ? resolveMarkazLabel(profile.governorate, profile.markaz)
    : null;

  return (
    <section
      aria-labelledby="checkout-delivery-heading"
      className={cn("space-y-3", className)}
    >
      <h2
        id="checkout-delivery-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        بيانات التوصيل
      </h2>

      {!hasCompleteProfile(profile) ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground" role="status">
            بيانات التوصيل المحفوظة على الحساب غير مكتملة. أكملي بياناتك قبل
            إتمام الطلب.
          </p>
          <Link
            href="/account"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            إكمال البيانات
          </Link>
        </div>
      ) : (
        <dl className="space-y-2 text-sm">
          {profile.fullName ? (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <dt className="text-muted-foreground">الاسم</dt>
              <dd className="font-medium text-foreground">{profile.fullName}</dd>
            </div>
          ) : null}
          {profile.phone ? (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <dt className="text-muted-foreground">الهاتف</dt>
              <dd className="font-medium text-foreground" dir="ltr">
                {profile.phone}
              </dd>
            </div>
          ) : null}
          {governorateLabel || markazLabel ? (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <dt className="text-muted-foreground">المنطقة</dt>
              <dd className="font-medium text-foreground">
                {[markazLabel, governorateLabel].filter(Boolean).join("، ")}
              </dd>
            </div>
          ) : null}
          {profile.addressText ? (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <dt className="text-muted-foreground">العنوان</dt>
              <dd className="font-medium text-foreground">
                {profile.addressText}
              </dd>
            </div>
          ) : null}
        </dl>
      )}
    </section>
  );
}
