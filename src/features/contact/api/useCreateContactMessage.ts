"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createContactMessage } from "./createContactMessage";
import { adminContactMessagesQueryKey } from "./queryKeys";
import type { CreateContactMessageInput } from "../types";

export function useCreateContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateContactMessageInput) =>
      createContactMessage(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminContactMessagesQueryKey(),
      });
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const message =
        raw === "INVALID_CONTACT_PAYLOAD"
          ? "بيانات الرسالة غير صحيحة"
          : raw === "CONTACT_RATE_LIMITED"
            ? "أرسلتِ رسائل كتير من نفس الرقم. جرّبي تاني بعد ساعة."
            : "حصل خطأ أثناء إرسال الرسالة، جرّبي تاني";
      toast.error(message);
    },
  });
}
