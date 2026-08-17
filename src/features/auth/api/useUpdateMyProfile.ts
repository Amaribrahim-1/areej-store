"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateMyProfile,
  type UpdateMyProfileInput,
} from "./updateMyProfile";

export function useUpdateMyProfile() {
  return useMutation({
    mutationFn: (input: UpdateMyProfileInput) => updateMyProfile(input),
    onSuccess: () => {
      toast.success("تم حفظ بياناتك");
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const message =
        raw === "INVALID_PROFILE_PAYLOAD"
          ? "بيانات غير صحيحة"
          : raw === "UNAUTHENTICATED"
            ? "لازم تكوني مسجّلة الدخول"
            : "حصل خطأ أثناء الحفظ، جرّبي تاني";
      toast.error(message);
    },
  });
}
