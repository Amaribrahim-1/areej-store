"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  loginCustomer,
  type LoginCustomerInput,
} from "./loginCustomer";

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginCustomerInput) => loginCustomer(input),
    onSuccess: () => {
      toast.success("تم تسجيل الدخول");
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const normalized = raw.toLowerCase();
      const message =
        normalized.includes("invalid login credentials") ||
        normalized.includes("invalid_credentials")
          ? "الإيميل أو كلمة المرور غير صحيحة"
          : normalized.includes("email not confirmed")
            ? "لازم تؤكدي الإيميل أولًا"
            : raw || "حصل خطأ، جرّبي تاني";
      toast.error(message);
    },
  });
}
