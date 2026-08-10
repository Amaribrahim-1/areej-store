import type { MyProfile } from "@/features/auth/api/getMyProfile";
import {
  GOVERNORATE_LABELS,
  getMarkazByGovernorate,
  isGovernorate,
} from "@/features/auth/data/egypt-locations";
import { cn } from "@/lib/utils";

type CheckoutDeliveryAddressProps = {
  profile: MyProfile | null;
  className?: string;
};

function resolveGovernorateLabel(governorate: string | null): string | null {
  if (!governorate) return null;
  if (isGovernorate(governorate)) return GOVERNORATE_LABELS[governorate];
  return governorate;
}

function resolveMarkazLabel(
  governorate: string | null,
  markaz: string | null,
): string | null {
  if (!markaz || !governorate) return markaz;
  const match = getMarkazByGovernorate(governorate).find(
    (option) => option.value === markaz,
  );
  return match?.label ?? markaz;
}

function hasDeliveryFields(profile: MyProfile): boolean {
  return Boolean(
    profile.fullName ||
      profile.phone ||
      profile.governorate ||
      profile.markaz ||
      profile.addressText,
  );
}

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

      {!profile || !hasDeliveryFields(profile) ? (
        <p className="text-sm text-muted-foreground" role="status">
          لا توجد بيانات توصيل محفوظة على الحساب. أكملي بياناتك قبل إتمام الطلب.
        </p>
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
