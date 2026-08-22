"use client";

import { PackageIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminProducts } from "../../api/admin/useAdminProducts";
import type { AdminProduct } from "../../types";

import AdminAddProductLink from "./AdminAddProductLink";
import AdminProductsList from "./AdminProductsList";

export default function AdminProductsPage() {
  const { data: products, isPending, isError, refetch } = useAdminProducts();
  const productList = products ?? [];
  const showList = !isPending && !isError && productList.length > 0;
  const showEmpty = !isPending && !isError && productList.length === 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
            المنتجات
          </h1>
          {showList ? (
            <p className="text-sm text-muted-foreground">
              {productCountLabel(
                productList.length,
                inactiveCount(productList),
              )}
            </p>
          ) : null}
        </div>
        <AdminAddProductLink />
      </header>

      {isPending ? <AdminProductsSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل المنتجات"
          description="تعذّر جلب قائمة المنتجات. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {showEmpty ? (
        <EmptyState
          icon={<PackageIcon />}
          title="لا توجد منتجات بعد"
          description="عندما تضيف منتجات، ستظهر هنا."
          action={<AdminAddProductLink />}
        />
      ) : null}

      {showList ? <AdminProductsList products={productList} /> : null}
    </div>
  );
}

function inactiveCount(products: AdminProduct[]): number {
  return products.filter((product) => product.status === "inactive").length;
}

function productCountLabel(total: number, hidden: number): string {
  const totalLabel = `${total} منتج`;
  if (hidden === 0) {
    return totalLabel;
  }
  return `${totalLabel} — منها ${hidden} غير ظاهر في المتجر`;
}

function AdminProductsSkeleton() {
  return (
    <div aria-busy="true" aria-label="جاري التحميل">
      <div className="flex flex-col gap-4 lg:hidden">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
      <Skeleton className="hidden h-64 w-full rounded-2xl lg:block" />
    </div>
  );
}
