"use client";

import { PackageIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminProducts } from "../../api/admin/useAdminProducts";
import type { AdminProduct } from "../../types";

export default function AdminProductsPage() {
  const { data: products, isPending, isError, refetch } = useAdminProducts();
  const productList = products ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          المنتجات
        </h1>
      </header>

      {isPending ? <AdminProductsSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل المنتجات"
          description="تعذّر جلب قائمة المنتجات. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && productList.length === 0 ? (
        <EmptyState
          icon={<PackageIcon />}
          title="لا توجد منتجات بعد"
          description="عندما تضيف منتجات، ستظهر هنا."
        />
      ) : null}

      {!isPending && !isError && productList.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          {productCountLabel(productList.length, inactiveCount(productList))}
        </p>
      ) : null}
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
    <div
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}
