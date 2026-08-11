"use client";

import { useMutation } from "@tanstack/react-query";
import {
  registerCustomer,
  type RegisterCustomerInput,
} from "./registerCustomer";

import { toast } from "sonner";

export type RegisterVariables = RegisterCustomerInput & {
  nextPath?: string;
};

export function useRegister() {
  return useMutation({
    mutationFn: ({ nextPath, ...input }: RegisterVariables) =>
      registerCustomer(input, { nextPath }),
    onSuccess: (result) => {
      toast.success(
        result.needsEmailConfirmation
          ? "تم إنشاء الحساب — راجعي إيميلك للتأكيد"
          : "تم إنشاء الحساب",
      );
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const message =
        raw === "EMAIL_ALREADY_REGISTERED"
          ? "الإيميل ده مسجّل قبل كده"
          : raw === "INVALID_REGISTER_PAYLOAD"
            ? "بيانات التسجيل غير صحيحة"
            : raw || "حصل خطأ، جرّبي تاني";
      toast.error(message);
    },
  });
}
