import StarRating from "@/components/shared/StarRating";
import UserAvatar from "@/components/shared/UserAvatar";

import { formatReviewDate } from "../../lib/formatReviewDate";
import type { AdminReview } from "../../types";

type AdminReviewCardProps = {
  review: AdminReview;
};

export default function AdminReviewCard({ review }: AdminReviewCardProps) {
  const headingId = `admin-review-${review.id}-heading`;

  return (
    <article
      className="rounded-2xl border border-border bg-card p-4"
      aria-labelledby={headingId}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <p
          id={headingId}
          className="font-heading text-sm font-semibold text-brand-700"
        >
          {review.productName}
        </p>
        <StarRating value={review.rating} size="sm" />
      </header>

      <div className="mt-3 flex items-start gap-3">
        <UserAvatar alt={`صورة ${review.authorName}`} size="sm" />

        <div className="min-w-0 flex-1 space-y-1 text-start">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {review.authorName}
            </p>
            <time
              dateTime={review.createdAt}
              className="text-xs text-muted-foreground"
            >
              {formatReviewDate(review.createdAt)}
            </time>
          </div>

          {review.comment ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/70 italic">
              بدون تعليق
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
