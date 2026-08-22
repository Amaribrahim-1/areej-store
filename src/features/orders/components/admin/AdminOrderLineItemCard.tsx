import PriceTag from "@/components/shared/PriceTag";

import type { AdminOrderLineItem } from "../../types";

type AdminOrderLineItemCardProps = {
  item: AdminOrderLineItem;
};

export default function AdminOrderLineItemCard({
  item,
}: AdminOrderLineItemCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <h3 className="font-heading text-base font-semibold text-foreground">
        {item.productName}
      </h3>
      {item.variantLabel ? (
        <p className="mt-0.5 text-sm text-muted-foreground">{item.variantLabel}</p>
      ) : null}

      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex flex-wrap justify-between gap-x-2 gap-y-1">
          <dt className="text-muted-foreground">السعر</dt>
          <dd>
            <PriceTag currentPrice={item.unitPrice} size="sm" />
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-2 gap-y-1">
          <dt className="text-muted-foreground">الكمية</dt>
          <dd className="font-medium text-foreground">{item.quantity}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-2 gap-y-1">
          <dt className="text-muted-foreground">إجمالي السطر</dt>
          <dd>
            <PriceTag currentPrice={item.lineTotal} size="sm" />
          </dd>
        </div>
      </dl>
    </article>
  );
}
