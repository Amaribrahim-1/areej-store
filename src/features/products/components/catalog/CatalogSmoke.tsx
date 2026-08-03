"use client";

import { formatPrice } from "@/components/shared/PriceTag";
import { useProducts } from "../../api/useProducts";
import { PRODUCT_CATEGORY_LABELS } from "../../constants";

/**
 * Temporary smoke UI for task 3.2.4 — proves the query against seeded data.
 * Replace with ProductGrid + filters in 3.4–3.7; do not treat this as final UX.
 */
export function CatalogSmoke() {
  const { data, isPending, isError, error } = useProducts({
    page: 1,
    sort: "newest",
  });

  if (isPending) {
    return <p className="p-4 text-start text-sm">جاري تحميل المنتجات…</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-start text-sm text-destructive" role="alert">
        فشل تحميل المنتجات: {error.message}
      </p>
    );
  }

  return (
    <div className="space-y-3 p-4 text-start">
      <p className="text-sm text-muted-foreground">
        Smoke 3.2 — {data.total} منتج (sort: newest)
      </p>
      <ul className="list-disc space-y-1 ps-5 text-sm">
        {data.items.map((product) => (
          <li key={product.id}>
            {product.name} — {PRODUCT_CATEGORY_LABELS[product.category]} —{" "}
            {formatPrice(product.currentPrice)}
            {product.averageRating !== null
              ? ` — ★ ${product.averageRating} (${product.reviewCount})`
              : " — بدون تقييم"}
          </li>
        ))}
      </ul>
    </div>
  );
}
