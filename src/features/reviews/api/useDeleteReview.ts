"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteReview, type DeleteReviewInput } from "./deleteReview";
import { invalidateReviewRelatedQueries } from "./invalidateReviewRelatedQueries";

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteReviewInput) => deleteReview(input),
    onSuccess: (_data, input) => {
      invalidateReviewRelatedQueries(queryClient, input.productSlug);
      toast.success("تم حذف تقييمك");
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const message =
        raw === "INVALID_REVIEW_PAYLOAD"
          ? "بيانات التقييم غير صحيحة"
          : raw === "UNAUTHENTICATED"
            ? "لازم تكوني مسجّلة الدخول عشان تقيّمي"
            : raw === "PRODUCT_NOT_FOUND"
              ? "المنتج غير متاح حاليًا"
              : raw === "REVIEW_NOT_FOUND"
                ? "مفيش تقييم للحذف على المنتج ده"
                : raw || "حصل خطأ أثناء حذف التقييم، جرّبي تاني";
      toast.error(message);
    },
  });
}
