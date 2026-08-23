"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteAdminReview,
  type DeleteAdminReviewInput,
} from "./deleteAdminReview";
import { invalidateAdminReviewRelatedQueries } from "./invalidateAdminReviewRelatedQueries";

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteAdminReviewInput) => deleteAdminReview(input),
    onSuccess: () => {
      invalidateAdminReviewRelatedQueries(queryClient);
      toast.success("تم حذف التقييم");
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const message =
        raw === "INVALID_REVIEW_PAYLOAD"
          ? "بيانات التقييم غير صحيحة"
          : raw === "REVIEW_NOT_FOUND"
            ? "التقييم ده مش موجود، ممكن يكون اتحذف قبل كده"
            : raw || "حصل خطأ أثناء حذف التقييم، جرّب تاني";
      toast.error(message);
    },
  });
}
