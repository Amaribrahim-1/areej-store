"use client";

import { Switch } from "@/components/ui/switch";

import { useSetProductStatus } from "../../api/admin/useSetProductStatus";
import { PRODUCT_STATUS_LABELS, type ProductStatus } from "../../constants";

type AdminProductStatusToggleProps = {
  productId: string;
  productName: string;
  status: ProductStatus;
  className?: string;
};

/**
 * Quick active/inactive toggle from the products table/cards (task 13.9).
 * Active controls storefront visibility — see `products_select_active_or_admin`.
 */
export default function AdminProductStatusToggle({
  productId,
  productName,
  status,
  className,
}: AdminProductStatusToggleProps) {
  const { mutate, isPending } = useSetProductStatus();
  const checked = status === "active";

  return (
    <div className={className}>
      <Switch
        checked={checked}
        disabled={isPending}
        aria-busy={isPending}
        onCheckedChange={(nextChecked) => {
          mutate({
            productId,
            status: nextChecked ? "active" : "inactive",
          });
        }}
        aria-label={`${checked ? "إخفاء" : "إظهار"} ${productName} في المتجر`}
      />
      <span className="ms-2 inline-block min-w-[4.5rem] text-start text-sm text-muted-foreground">
        {PRODUCT_STATUS_LABELS[status]}
      </span>
    </div>
  );
}
