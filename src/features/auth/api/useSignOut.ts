"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { signOutSession } from "./signOutSession";

export function useSignOut() {
  return useMutation({
    mutationFn: signOutSession,
    onSuccess: () => {
      toast.success("تم تسجيل الخروج");
    },
    onError: () => {
      toast.error("تعذر تسجيل الخروج، حاول مرة أخرى");
    },
  });
}
