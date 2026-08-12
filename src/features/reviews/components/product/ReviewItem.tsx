import StarRating from "@/components/shared/StarRating";
import UserAvatar from "@/components/shared/UserAvatar";

import type { ProductReview } from "../../types";

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

type ReviewItemProps = {
  review: ProductReview;
};

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <li className="flex gap-3 border-b border-border/70 pb-6 last:border-b-0 last:pb-0 sm:gap-4">
      <UserAvatar
        alt={`صورة ${review.authorName}`}
        size="md"
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1 space-y-2 text-start">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="font-medium text-foreground">{review.authorName}</p>
          <time
            dateTime={review.createdAt}
            className="text-xs text-muted-foreground"
          >
            {dateFormatter.format(new Date(review.createdAt))}
          </time>
        </div>

        <StarRating value={review.rating} size="sm" />

        {review.comment ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {review.comment}
          </p>
        ) : null}
      </div>
    </li>
  );
}
