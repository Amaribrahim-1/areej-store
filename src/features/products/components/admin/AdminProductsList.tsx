import type { AdminProduct } from "../../types";

import AdminProductCard from "./AdminProductCard";
import AdminProductsTable from "./AdminProductsTable";

type AdminProductsListProps = {
  products: AdminProduct[];
};

export default function AdminProductsList({
  products,
}: AdminProductsListProps) {
  return (
    <>
      <ul className="flex flex-col gap-4 lg:hidden" aria-label="قائمة المنتجات">
        {products.map((product) => (
          <li key={product.id}>
            <AdminProductCard product={product} />
          </li>
        ))}
      </ul>
      <div className="hidden lg:block">
        <AdminProductsTable products={products} />
      </div>
    </>
  );
}
