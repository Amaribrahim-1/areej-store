import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import PriceTag from "@/components/shared/PriceTag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatOrderAddress } from "../../lib/formatOrderAddress";
import { formatOrderPlacedAt } from "../../lib/formatOrderPlacedAt";
import type { AdminOrder } from "../../types";

import AdminOrderDetailsLink from "./AdminOrderDetailsLink";
import AdminOrderPhoneLink from "./AdminOrderPhoneLink";

type AdminOrdersTableProps = {
  orders: AdminOrder[];
};

export default function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table aria-label="قائمة الطلبات">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>العميل</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>الإجمالي</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>
              <span className="sr-only">التفاصيل</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <AdminOrderTableRow key={order.id} order={order} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AdminOrderTableRow({ order }: { order: AdminOrder }) {
  const address = formatOrderAddress(order);
  const placedAt = formatOrderPlacedAt(order.createdAt);

  return (
    <TableRow>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="max-w-56 whitespace-normal">
        <span className="line-clamp-2" title={address}>
          {address}
        </span>
      </TableCell>
      <TableCell>
        <PriceTag currentPrice={order.total} size="sm" />
      </TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell>
        <time dateTime={order.createdAt}>{placedAt}</time>
      </TableCell>
      <TableCell>
        <AdminOrderPhoneLink phone={order.customerPhone} />
      </TableCell>
      <TableCell>
        <AdminOrderDetailsLink
          orderId={order.id}
          customerName={order.customerName}
        />
      </TableCell>
    </TableRow>
  );
}
