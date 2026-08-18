"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { loginAdmin } from "./loginAdmin";
import type { LoginAdminInput } from "../types";

export function useAdminLogin() {
  return useMutation({
    mutationFn: (input: LoginAdminInput) => loginAdmin(input),
    onSuccess: () => {
      toast.success("تم تسجيل الدخول", { id: "admin-login" });
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const normalized = raw.toLowerCase();
      const message =
        raw === "INVALID_LOGIN_PAYLOAD"
          ? "بيانات الدخول غير صحيحة"
          : raw === "NOT_ADMIN"
            ? "هذا الحساب ليس حساب مدير"
            : normalized.includes("invalid login credentials") ||
                normalized.includes("invalid_credentials")
              ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
              : normalized.includes("email not confirmed")
                ? "يلزم تأكيد البريد الإلكتروني أولًا"
                : raw === "LOGIN_FAILED" || raw === "ADMIN_PROFILE_UNAVAILABLE"
                  ? "حدث خطأ، حاول مرة أخرى"
                  : raw || "حدث خطأ، حاول مرة أخرى";
      toast.error(message, { id: "admin-login" });
    },
  });
}
