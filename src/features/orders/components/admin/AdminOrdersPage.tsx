"use client";

import { PackageIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminOrders } from "../../api/admin/useAdminOrders";

export default function AdminOrdersPage() {
  const { data: orders, isPending, isError, refetch } = useAdminOrders();
  const orderList = orders ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          الطلبات
        </h1>
      </header>

      {isPending ? <AdminOrdersSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل الطلبات"
          description="تعذّر جلب قائمة الطلبات. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && orderList.length === 0 ? (
        <EmptyState
          icon={<PackageIcon />}
          title="لا توجد طلبات بعد"
          description="عندما يضع العملاء طلبات، ستظهر هنا."
        />
      ) : null}
    </div>
  );
}

function AdminOrdersSkeleton() {
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
