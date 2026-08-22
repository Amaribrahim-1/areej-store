import type { AdminOrderLineItem } from "../../types";

import AdminOrderLineItemCard from "./AdminOrderLineItemCard";
import AdminOrderItemsTable from "./AdminOrderItemsTable";

type AdminOrderItemsListProps = {
  items: AdminOrderLineItem[];
};

export default function AdminOrderItemsList({ items }: AdminOrderItemsListProps) {
  return (
    <section aria-labelledby="admin-order-items-heading" className="space-y-3">
      <h2
        id="admin-order-items-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        المنتجات
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد منتجات في هذا الطلب.</p>
      ) : (
        <>
          <ul
            className="flex flex-col gap-4 lg:hidden"
            aria-label="منتجات الطلب"
          >
            {items.map((item) => (
              <li key={item.id}>
                <AdminOrderLineItemCard item={item} />
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
            <AdminOrderItemsTable items={items} />
          </div>
        </>
      )}
    </section>
  );
}
