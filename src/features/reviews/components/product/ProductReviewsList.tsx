"use client";

import { MessageSquareIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

import { useProductReviews } from "../../api/useProductReviews";
import AddReviewForm from "./AddReviewForm";
import ProductReviewsSkeleton from "./ProductReviewsSkeleton";
import ReviewItem from "./ReviewItem";

type ProductReviewsListProps = {
  slug: string;
};

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
          titleAs="p"
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

      <AddReviewForm slug={slug} />
    </section>
  );
}
