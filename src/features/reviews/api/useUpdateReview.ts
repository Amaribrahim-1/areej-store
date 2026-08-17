"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateReview, type UpdateReviewInput } from "./updateReview";

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateReviewInput) => updateReview(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["my-product-review"] });
      void queryClient.invalidateQueries({ queryKey: ["home-testimonials"] });
      void queryClient.invalidateQueries({ queryKey: ["product"] });
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
