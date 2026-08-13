"use client";

import { PackageIcon } from "lucide-react";
import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyOrders } from "../api/useMyOrders";

import MyOrderCard from "./MyOrderCard";

export default function MyOrdersList() {
  const { data: orders, isPending, isError, refetch } = useMyOrders();

  if (isPending) {
    return <MyOrdersListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="تعذر تحميل الطلبات"
        description="حصل مشكلة وإحنا بنجيب سجل طلباتك. جرّبي تاني."
        onRetry={() => refetch()}
      />
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={<PackageIcon />}
        title="لسه مفيش طلبات"
        description="لما تعملي طلب، هتلاقيه هنا بالتفاصيل والحالة."
        action={
          <Button render={<Link href="/products" />}>تصفح المنتجات</Button>
        }
      />
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {orders.map((order) => (
        <MyOrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function MyOrdersListSkeleton() {
  return (
    <div
      className="mt-6 flex flex-col gap-4"
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}
