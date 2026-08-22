import PriceTag from "@/components/shared/PriceTag";

import type { AdminOrderDetail } from "../../types";

import AdminOrderCustomerBlock from "./AdminOrderCustomerBlock";
import AdminOrderItemsList from "./AdminOrderItemsList";
import AdminOrderStatusControl from "./AdminOrderStatusControl";

type AdminOrderDetailsProps = {
  order: AdminOrderDetail;
};

export default function AdminOrderDetails({ order }: AdminOrderDetailsProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          {order.customerName}
        </h1>
        <AdminOrderStatusControl orderId={order.id} status={order.status} />
      </header>

      <AdminOrderCustomerBlock order={order} />
      <AdminOrderItemsList items={order.items} />

      <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">الإجمالي</span>
        <PriceTag currentPrice={order.total} size="lg" />
      </div>
    </div>
  );
}
