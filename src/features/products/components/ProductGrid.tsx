"use client";

import { ProductGridSkeleton } from "@/components/shared/ContentSkeleton";

import { useProducts } from "../api/useProducts";
import {
  PRODUCTS_PAGE_SIZE,
  type ProductCategory,
} from "../constants";
import useCatalogFilterParams from "../hooks/useCatalogFilterParams";
import type { ProductSort } from "../types";
import ProductCard from "./ProductCard";

/**
 * Storefront catalog grid — params come from URL via useCatalogFilterParams.
 */
export default function ProductGrid() {
  const {
    selectedCategory,
    selectedRating,
    selectedSorting,
    minPrice,
    maxPrice,
  } = useCatalogFilterParams();

  const { data, isPending, isError, error } = useProducts({
    page: 1,
    pageSize: PRODUCTS_PAGE_SIZE,
    category: selectedCategory
      ? (selectedCategory as ProductCategory)
      : undefined,
    minRating: toOptionalNumber(selectedRating),
    minPrice: toOptionalNumber(minPrice),
    maxPrice: toOptionalNumber(maxPrice),
    sort: selectedSorting as ProductSort,
  });

  if (isPending) {
    return <ProductGridSkeleton count={PRODUCTS_PAGE_SIZE} />;
  }

  if (isError) {
    return (
      <p className="text-start text-sm text-destructive" role="alert">
        فشل تحميل المنتجات: {error.message}
      </p>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="rounded-2xl bg-brand-50 px-6 py-16 text-center">
        <p className="font-heading text-lg text-brand-800">لا توجد منتجات</p>
        <p className="mt-2 text-muted-foreground text-sm">
          لم نعثر على منتجات للعرض حالياً. حاول لاحقاً.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">عرض {data.total} منتج</p>
      <ul className="grid list-none grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {data.items.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function toOptionalNumber(raw: string): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}
