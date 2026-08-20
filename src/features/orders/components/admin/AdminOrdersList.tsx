import type { AdminOrder } from "../../types";

import AdminOrderCard from "./AdminOrderCard";
import AdminOrdersTable from "./AdminOrdersTable";

type AdminOrdersListProps = {
  orders: AdminOrder[];
};

export default function AdminOrdersList({ orders }: AdminOrdersListProps) {
  return (
    <>
      <ul className="flex flex-col gap-4 lg:hidden" aria-label="قائمة الطلبات">
        {orders.map((order) => (
          <li key={order.id}>
            <AdminOrderCard order={order} />
          </li>
        ))}
      </ul>
      <div className="hidden lg:block">
        <AdminOrdersTable orders={orders} />
      </div>
    </>
  );
}
