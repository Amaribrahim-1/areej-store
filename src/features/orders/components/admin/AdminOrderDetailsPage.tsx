"use client";

import { PackageIcon } from "lucide-react";
import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminOrder } from "../../api/admin/useAdminOrder";

import AdminOrderBackLink from "./AdminOrderBackLink";
import AdminOrderDetails from "./AdminOrderDetails";

type AdminOrderDetailsPageProps = {
  orderId: string;
};

export default function AdminOrderDetailsPage({
  orderId,
}: AdminOrderDetailsPageProps) {
  const { data: order, isPending, isError, refetch } = useAdminOrder(orderId);

  const showFallbackHeading = isPending || isError || !order;

  return (
    <div className="space-y-6">
      <AdminOrderBackLink />

      {showFallbackHeading ? (
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          تفاصيل الطلب
        </h1>
      ) : null}

      {isPending ? <AdminOrderDetailsSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل الطلب"
          description="تعذّر جلب تفاصيل الطلب. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && !order ? <AdminOrderNotFound /> : null}

      {!isPending && !isError && order ? (
        <AdminOrderDetails order={order} />
      ) : null}
    </div>
  );
}

function AdminOrderNotFound() {
  return (
    <EmptyState
      icon={<PackageIcon />}
      title="الطلب غير موجود"
      description="الطلب ده مش موجود، أو الرابط غير صحيح."
      action={
        <Button render={<Link href="/admin/orders" />} variant="outline">
          العودة للطلبات
        </Button>
      }
    />
  );
}

function AdminOrderDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="جاري التحميل">
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="flex flex-col gap-4 lg:hidden">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
      <Skeleton className="hidden h-48 w-full rounded-2xl lg:block" />
    </div>
  );
}
