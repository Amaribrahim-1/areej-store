import PriceTag from "@/components/shared/PriceTag";

import type { AdminProduct } from "../../types";

import AdminProductEditLink from "./AdminProductEditLink";
import AdminProductField from "./AdminProductField";
import AdminProductStatusToggle from "./AdminProductStatusToggle";

type AdminProductCardProps = {
  product: AdminProduct;
};

export default function AdminProductCard({ product }: AdminProductCardProps) {
  const headingId = `admin-product-${product.id}-heading`;
  const categoryLabel = product.categoryLabel;

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
          {product.name}
        </h2>
        <AdminProductStatusToggle
          productId={product.id}
          productName={product.name}
          status={product.status}
          className="flex items-center"
        />
      </header>

      <dl className="mt-3 space-y-2 text-sm">
        <AdminProductField label="الفئة">{categoryLabel}</AdminProductField>
        <AdminProductField label="السعر">
          <PriceTag
            currentPrice={product.currentPrice}
            originalPrice={product.originalPrice}
            size="sm"
          />
        </AdminProductField>
      </dl>

      <div className="mt-4">
        <AdminProductEditLink
          productId={product.id}
          productName={product.name}
        />
      </div>
    </article>
  );
}
