"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { invalidateReviewRelatedQueries } from "./invalidateReviewRelatedQueries";
import { updateReview, type UpdateReviewInput } from "./updateReview";

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateReviewInput) => updateReview(input),
    onSuccess: (_data, input) => {
      invalidateReviewRelatedQueries(queryClient, input.productSlug);
      toast.success("تم تعديل تقييمك");
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
                ? "مفيش تقييم للتعديل على المنتج ده"
                : raw || "حصل خطأ أثناء تعديل التقييم، جرّبي تاني";
      toast.error(message);
    },
  });
}
