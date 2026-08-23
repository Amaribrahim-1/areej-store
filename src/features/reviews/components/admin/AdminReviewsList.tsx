import type { AdminReview } from "../../types";

import AdminReviewCard from "./AdminReviewCard";

type AdminReviewsListProps = {
  reviews: AdminReview[];
};

export default function AdminReviewsList({ reviews }: AdminReviewsListProps) {
  return (
    <ul className="flex flex-col gap-4" aria-label="قائمة التقييمات">
      {reviews.map((review) => (
        <li key={review.id}>
          <AdminReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}
