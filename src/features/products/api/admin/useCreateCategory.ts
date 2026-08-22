"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { categoriesQueryKey } from "../useCategories";
import { createCategory } from "./createCategory";
import type { CategoryInput } from "../../schema";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey() });
      toast.success("تمت إضافة الفئة");
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const message =
        raw === "INVALID_CATEGORY_PAYLOAD"
          ? "بيانات الفئة غير صحيحة"
          : raw === "CATEGORY_ALREADY_EXISTS"
            ? "الفئة دي موجودة قبل كده"
            : raw || "حصل خطأ أثناء إضافة الفئة، جرّب تاني";
      toast.error(message);
    },
  });
}
