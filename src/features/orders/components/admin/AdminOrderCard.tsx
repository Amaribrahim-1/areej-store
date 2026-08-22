import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import PriceTag from "@/components/shared/PriceTag";

import { formatOrderAddress } from "../../lib/formatOrderAddress";
import { formatOrderPlacedAt } from "../../lib/formatOrderPlacedAt";
import type { AdminOrder } from "../../types";

import AdminOrderDetailsLink from "./AdminOrderDetailsLink";
import AdminOrderField from "./AdminOrderField";
import AdminOrderPhoneLink from "./AdminOrderPhoneLink";

type AdminOrderCardProps = {
  order: AdminOrder;
};

export default function AdminOrderCard({ order }: AdminOrderCardProps) {
  const address = formatOrderAddress(order);
  const placedAt = formatOrderPlacedAt(order.createdAt);
  const headingId = `admin-order-${order.id}-heading`;

  return (
    <article
      className="rounded-2xl border border-border bg-card p-4"
      aria-labelledby={headingId}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <h2
          id={headingId}
          className="font-heading text-base font-semibold text-foreground"
        >
          {order.customerName}
        </h2>
        <OrderStatusBadge status={order.status} />
      </header>

      <dl className="mt-3 space-y-2 text-sm">
        <AdminOrderField label="الهاتف">
          <AdminOrderPhoneLink phone={order.customerPhone} />
        </AdminOrderField>
        <AdminOrderField label="التاريخ">
          <time dateTime={order.createdAt}>{placedAt}</time>
        </AdminOrderField>
        <AdminOrderField label="الإجمالي">
          <PriceTag currentPrice={order.total} size="sm" />
        </AdminOrderField>
        <AdminOrderField label="العنوان">{address}</AdminOrderField>
      </dl>

      <div className="mt-4">
        <AdminOrderDetailsLink
          orderId={order.id}
          customerName={order.customerName}
        />
      </div>
    </article>
  );
}
