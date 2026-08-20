import type { ReactNode } from "react";

import { PAYMENT_METHOD_LABELS } from "../../constants";
import { formatOrderAddress } from "../../lib/formatOrderAddress";
import { formatOrderPlacedAt } from "../../lib/formatOrderPlacedAt";
import type { AdminOrderDetail } from "../../types";

import AdminOrderPhoneLink from "./AdminOrderPhoneLink";

type AdminOrderCustomerBlockProps = {
  order: AdminOrderDetail;
};

export default function AdminOrderCustomerBlock({
  order,
}: AdminOrderCustomerBlockProps) {
  const address = formatOrderAddress(order);
  const placedAt = formatOrderPlacedAt(order.createdAt);

  return (
    <section
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
      aria-labelledby="admin-order-customer-heading"
    >
      <h2
        id="admin-order-customer-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        العميل والتوصيل
      </h2>

      <dl className="mt-3 space-y-2 text-sm">
        <OrderField label="الاسم">{order.customerName}</OrderField>
        <OrderField label="الهاتف">
          <AdminOrderPhoneLink phone={order.customerPhone} />
        </OrderField>
        <OrderField label="العنوان">{address}</OrderField>
        <OrderField label="التاريخ">
          <time dateTime={order.createdAt}>{placedAt}</time>
        </OrderField>
        <OrderField label="الدفع">
          {PAYMENT_METHOD_LABELS[order.paymentMethod]}
        </OrderField>
      </dl>
    </section>
  );
}

function OrderField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium text-foreground">{children}</dd>
    </div>
  );
}
