"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { signOutCustomer } from "./signOutCustomer";

export function useSignOut() {
  return useMutation({
    mutationFn: signOutCustomer,
    onSuccess: () => {
      toast.success("تم تسجيل الخروج");
    },
    onError: () => {
      toast.error("مقدرناش نطلّعك، جرّبي تاني");
    },
  });
}
