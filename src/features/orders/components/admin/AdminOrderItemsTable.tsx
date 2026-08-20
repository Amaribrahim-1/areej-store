import PriceTag from "@/components/shared/PriceTag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AdminOrderLineItem } from "../../types";

type AdminOrderItemsTableProps = {
  items: AdminOrderLineItem[];
};

export default function AdminOrderItemsTable({
  items,
}: AdminOrderItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table aria-label="منتجات الطلب">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>المنتج</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>إجمالي السطر</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <AdminOrderItemRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AdminOrderItemRow({ item }: { item: AdminOrderLineItem }) {
  return (
    <TableRow>
      <TableCell className="whitespace-normal">
        <p className="font-medium">{item.productName}</p>
        {item.variantLabel ? (
          <p className="text-muted-foreground">{item.variantLabel}</p>
        ) : null}
      </TableCell>
      <TableCell>
        <PriceTag currentPrice={item.unitPrice} size="sm" />
      </TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>
        <PriceTag currentPrice={item.lineTotal} size="sm" />
      </TableCell>
    </TableRow>
  );
}
