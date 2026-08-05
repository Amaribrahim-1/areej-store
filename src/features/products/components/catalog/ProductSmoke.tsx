"use client";

import { useProduct } from "../../api/useProduct";

export function ProductSmoke() {
  const {
    data: product,
    isPending,
    isError,
    error,
  } = useProduct({
    slug: "oud-malaki",
  });

  if (isPending) {
    return <p className="p-4 text-start text-sm">جاري تحميل المنتج</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-start text-sm text-destructive" role="alert">
        فشل تحميل المنتج: {error.message}
      </p>
    );
  }

  if (product === null) {
    return <p className="p-4 text-start text-sm">المنتج غير موجود</p>;
  }

  return (
    <div className="space-y-3 p-4 text-start">
      <p className="text-sm text-muted-foreground">
        Smoke 3.3 — {product?.name}
      </p>
      <ul>
        <li>{product?.id}</li>
        <li>{product?.slug}</li>
        <li>{product?.name}</li>
        <li>{product?.description}</li>
        <li>{product?.averageRating}</li>
        <li>{product?.reviewCount}</li>
        <li>
          <ul>
            {product?.variants.map((variant) => (
              <li key={variant.id}>{variant.volumeLabel}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
