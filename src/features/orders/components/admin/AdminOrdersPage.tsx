"use client";

import { PackageIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminOrders } from "../../api/admin/useAdminOrders";
import useAdminOrdersListParams from "../../hooks/useAdminOrdersListParams";
import { filterAndSortAdminOrders } from "../../lib/filterAndSortAdminOrders";

import AdminOrdersList from "./AdminOrdersList";
import AdminOrdersToolbar from "./AdminOrdersToolbar";

export default function AdminOrdersPage() {
  const { data: orders, isPending, isError, refetch } = useAdminOrders();
  const { selectedStatus, selectedSort, updateListParam } =
    useAdminOrdersListParams();
  const orderList = orders ?? [];
  const visibleOrders = filterAndSortAdminOrders(orderList, {
    status: selectedStatus,
    sort: selectedSort,
  });
  const hasStatusFilter = selectedStatus !== undefined;
  const showToolbar =
    !isPending && !isError && (orderList.length > 0 || hasStatusFilter);
  const showShopEmpty =
    !isPending && !isError && orderList.length === 0 && !hasStatusFilter;
  const showFilterEmpty =
    !isPending &&
    !isError &&
    visibleOrders.length === 0 &&
    (orderList.length > 0 || hasStatusFilter);

  function handleStatusChange(value: string) {
    updateListParam("status", value);
  }

  function handleSortChange(value: string) {
    updateListParam("sort", value);
  }

  function clearStatusFilter() {
    updateListParam("status", "");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          الطلبات
        </h1>
      </header>

      {showToolbar ? (
        <AdminOrdersToolbar
          selectedStatus={selectedStatus}
          selectedSort={selectedSort}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
        />
      ) : null}

      {isPending ? <AdminOrdersSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل الطلبات"
          description="تعذّر جلب قائمة الطلبات. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {showShopEmpty ? (
        <EmptyState
          icon={<PackageIcon />}
          title="لا توجد طلبات بعد"
          description="عندما يضع العملاء طلبات، ستظهر هنا."
        />
      ) : null}

      {showFilterEmpty ? (
        <EmptyState
          icon={<PackageIcon />}
          title="لا توجد طلبات بهذه الحالة"
          description="جرّب حالة أخرى أو اعرض كل الطلبات."
          action={
            hasStatusFilter ? (
              <Button
                type="button"
                variant="outline"
                onClick={clearStatusFilter}
              >
                عرض كل الطلبات
              </Button>
            ) : null
          }
        />
      ) : null}

      {!isPending && !isError && visibleOrders.length > 0 ? (
        <AdminOrdersList orders={visibleOrders} />
      ) : null}
    </div>
  );
}

function AdminOrdersSkeleton() {
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
