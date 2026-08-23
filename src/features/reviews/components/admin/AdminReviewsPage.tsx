"use client";

import { StarIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/ContentSkeleton";

import { useAllReviews } from "../../api/useAllReviews";

import AdminReviewsList from "./AdminReviewsList";

export default function AdminReviewsPage() {
  const { data: reviews, isPending, isError, refetch } = useAllReviews();
  const reviewList = reviews ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          التقييمات
        </h1>
      </header>

      {isPending ? <ListSkeleton count={6} /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل التقييمات"
          description="تعذّر جلب قائمة التقييمات. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && reviewList.length === 0 ? (
        <EmptyState
          icon={<StarIcon />}
          title="لا توجد تقييمات بعد"
          description="عندما يقيّم العملاء المنتجات، ستظهر هنا."
        />
      ) : null}

      {!isPending && !isError && reviewList.length > 0 ? (
        <AdminReviewsList reviews={reviewList} />
      ) : null}
    </div>
  );
}
