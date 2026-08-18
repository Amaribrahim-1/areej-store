"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { adminLoginErrorMessage } from "../lib/adminLoginErrorMessage";
import type { LoginAdminInput } from "../types";
import { loginAdmin } from "./loginAdmin";

export function useAdminLogin() {
  return useMutation({
    mutationFn: (input: LoginAdminInput) => loginAdmin(input),
    onSuccess: () => {
      toast.success("تم تسجيل الدخول", { id: "admin-login" });
    },
    onError: (error) => {
      toast.error(adminLoginErrorMessage(error), { id: "admin-login" });
    },
  });
}
