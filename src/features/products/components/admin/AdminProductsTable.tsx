import PriceTag from "@/components/shared/PriceTag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AdminProduct } from "../../types";

import AdminProductEditLink from "./AdminProductEditLink";
import AdminProductStatusToggle from "./AdminProductStatusToggle";

type AdminProductsTableProps = {
  products: AdminProduct[];
};

export default function AdminProductsTable({
  products,
}: AdminProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table aria-label="قائمة المنتجات">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>الاسم</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead className="w-32">الحالة</TableHead>
            <TableHead>
              <span className="sr-only">تعديل</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <AdminProductTableRow key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AdminProductTableRow({ product }: { product: AdminProduct }) {
  const categoryLabel = product.categoryLabel;

  return (
    <TableRow>
      <TableCell className="max-w-64 whitespace-normal font-medium">
        {product.name}
      </TableCell>
      <TableCell>{categoryLabel}</TableCell>
      <TableCell>
        <PriceTag
          currentPrice={product.currentPrice}
          originalPrice={product.originalPrice}
          size="sm"
        />
      </TableCell>
      <TableCell>
        <AdminProductStatusToggle
          productId={product.id}
          productName={product.name}
          status={product.status}
          className="flex items-center"
        />
      </TableCell>
      <TableCell>
        <AdminProductEditLink
          productId={product.id}
          productName={product.name}
        />
      </TableCell>
    </TableRow>
  );
}
