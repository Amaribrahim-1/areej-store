"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createReview, type CreateReviewInput } from "./createReview";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => createReview(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["my-product-review"] });
      void queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("تم إرسال تقييمك");
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
              : raw === "REVIEW_ALREADY_EXISTS"
                ? "قيّمتي المنتج ده قبل كده"
                : raw || "حصل خطأ أثناء إرسال التقييم، جرّبي تاني";
      toast.error(message);
    },
  });
}
