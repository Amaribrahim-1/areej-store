"use client";

import { useMutation } from "@tanstack/react-query";
import {
  registerCustomer,
  type RegisterCustomerInput,
} from "./registerCustomer";

import { toast } from "sonner";

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterCustomerInput) => registerCustomer(input),
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
          : raw || "حصل خطأ، جرّبي تاني";
      toast.error(message);
    },
  });
}
