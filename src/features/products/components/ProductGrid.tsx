"use client";

import { useEffect } from "react";
import { PackageSearchIcon } from "lucide-react";

import { ProductGridSkeleton } from "@/components/shared/ContentSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

import { useProducts } from "../api/useProducts";
import { PRODUCTS_PAGE_SIZE, type ProductCategory } from "../constants";
import useCatalogFilterParams from "../hooks/useCatalogFilterParams";
import type { ProductSort } from "../types";
import CatalogPagination from "./CatalogPagination";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const {
    selectedCategory,
    selectedRating,
    selectedSorting,
    minPrice,
    maxPrice,
    searchValue,
    page,
    setPage,
  } = useCatalogFilterParams();

  const { data, isPending, isError, refetch } = useProducts({
    page,
    pageSize: PRODUCTS_PAGE_SIZE,
    category: selectedCategory
      ? (selectedCategory as ProductCategory)
      : undefined,
    minRating: toOptionalNumber(selectedRating),
    minPrice: toOptionalNumber(minPrice),
    maxPrice: toOptionalNumber(maxPrice),
    sort: selectedSorting as ProductSort,
    search: searchValue,
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / PRODUCTS_PAGE_SIZE))
    : 1;

  useEffect(() => {
    if (isPending || !data) return;
    if (data.total === 0) return;
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [isPending, data, page, totalPages, setPage]);

  if (isPending) {
    return <ProductGridSkeleton count={PRODUCTS_PAGE_SIZE} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="فشل تحميل المنتجات"
        description="تعذّر جلب قائمة المنتجات. حاولي مرة أخرى."
        onRetry={() => refetch()}
      />
    );
  }

  if (data.total > 0 && page > totalPages) {
    return <ProductGridSkeleton count={PRODUCTS_PAGE_SIZE} />;
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={<PackageSearchIcon />}
        title="لا توجد منتجات"
        description="لم نعثر على منتجات تطابق البحث أو الفلاتر الحالية. جرّبي تعديل التصفية."
      />
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
      <CatalogPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

function toOptionalNumber(raw: string): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}
