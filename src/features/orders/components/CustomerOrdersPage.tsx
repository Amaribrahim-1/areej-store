"use client";

import { PackageIcon } from "lucide-react";
import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCustomerOrders } from "../api/useCustomerOrders";

import CustomerOrderCard from "./CustomerOrderCard";

export default function CustomerOrdersPage() {
  const { data: orders, isPending, isError, refetch } = useCustomerOrders();
  const orderList = orders ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          طلباتي
        </h1>
        <p className="text-sm text-muted-foreground">
          هنا تتابعي طلباتك: المنتجات، الإجمالي، وحالة التوصيل.
        </p>
      </header>

      {isPending ? <CustomerOrdersSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل الطلبات"
          description="حصل مشكلة وإحنا بنجيب سجل طلباتك. جرّبي تاني."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && orderList.length === 0 ? (
        <EmptyState
          icon={<PackageIcon />}
          title="لسه مفيش طلبات"
          description="لما تعملي طلب، هتلاقيه هنا بالتفاصيل والحالة."
          action={
            <Button render={<Link href="/products" />}>تصفّحي المنتجات</Button>
          }
        />
      ) : null}

      {!isPending && !isError && orderList.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orderList.map((order) => (
            <CustomerOrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CustomerOrdersSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="جاري التحميل">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}
