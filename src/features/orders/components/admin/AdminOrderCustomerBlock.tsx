import { PAYMENT_METHOD_LABELS } from "../../constants";
import { formatOrderAddress } from "../../lib/formatOrderAddress";
import { formatOrderPlacedAt } from "../../lib/formatOrderPlacedAt";
import type { AdminOrderDetail } from "../../types";

import AdminOrderField from "./AdminOrderField";
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
        <AdminOrderField label="الاسم">{order.customerName}</AdminOrderField>
        <AdminOrderField label="الهاتف">
          <AdminOrderPhoneLink phone={order.customerPhone} />
        </AdminOrderField>
        <AdminOrderField label="العنوان">{address}</AdminOrderField>
        <AdminOrderField label="التاريخ">
          <time dateTime={order.createdAt}>{placedAt}</time>
        </AdminOrderField>
        <AdminOrderField label="الدفع">
          {PAYMENT_METHOD_LABELS[order.paymentMethod]}
        </AdminOrderField>
      </dl>
    </section>
  );
}
