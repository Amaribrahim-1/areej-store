"use client";

import { MessageSquareIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import StarRating from "@/components/shared/StarRating";
import { Skeleton } from "@/components/ui/skeleton";

import { useProductReviews } from "../../api/useProductReviews";
import type { ProductReview } from "../../types";
import AddReviewForm from "./AddReviewForm";

type ProductReviewsListProps = {
  slug: string;
};

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function ProductReviewsList({ slug }: ProductReviewsListProps) {
  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
  } = useProductReviews({
    slug,
  });

  return (
    <section
      className="mt-10 space-y-6 border-t border-border pt-10"
      aria-labelledby="product-reviews-heading"
    >
      <h2
        id="product-reviews-heading"
        className="font-heading text-xl font-semibold text-foreground"
      >
        آراء العملاء
      </h2>

      {isLoading ? <ProductReviewsSkeleton /> : null}

      {isError ? (
        <ErrorState title="تعذّر تحميل التقييمات" onRetry={() => refetch()} />
      ) : null}

      {!isLoading && !isError && reviews?.length === 0 ? (
        <EmptyState
          icon={<MessageSquareIcon />}
          title="لا توجد تقييمات بعد"
          description="كن أول من يقيّم هذا المنتج."
          className="py-8"
        />
      ) : null}

      {!isLoading && !isError && reviews && reviews.length > 0 ? (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      ) : null}

      <AddReviewForm />
    </section>
  );
}

function ReviewItem({ review }: { review: ProductReview }) {
  return (
    <li className="space-y-2 text-start">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="font-medium text-foreground">{review.authorName}</p>
        <StarRating value={review.rating} size="sm" />
        <time
          dateTime={review.createdAt}
          className="text-xs text-muted-foreground"
        >
          {dateFormatter.format(new Date(review.createdAt))}
        </time>
      </div>
      {review.comment ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      ) : null}
    </li>
  );
}

function ProductReviewsSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="جاري تحميل التقييمات"
    >
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
