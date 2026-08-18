"use client";

import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminDashboardKpis } from "../api/useAdminDashboardKpis";

import DashboardKpiCards from "./DashboardKpiCards";

export default function AdminDashboardPage() {
  const { data: kpis, isPending, isError, refetch } = useAdminDashboardKpis();

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          لوحة التحكم
        </h1>
        <p className="text-sm text-muted-foreground">
          نظرة سريعة على المبيعات والطلبات والمنتجات.
        </p>
      </header>

      {isPending ? <DashboardKpiCardsSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل أرقام اللوحة"
          description="حصل مشكلة وإحنا بنجيب ملخص المتجر. حاول مرة أخرى."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && kpis ? <DashboardKpiCards kpis={kpis} /> : null}
    </div>
  );
}

function DashboardKpiCardsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
    </div>
  );
}
