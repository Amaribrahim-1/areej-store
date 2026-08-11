"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { placeOrder, type PlaceOrderInput } from "./placeOrder";

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: () => {
      toast.success("تم استلام طلبك — هنتواصل معاكي قريبًا لتأكيد التوصيل");
    },
    onError: (error) => {
      const raw = error instanceof Error ? error.message : "";
      const normalized = raw.toLowerCase();
      const message =
        raw === "INVALID_CHECKOUT_PAYLOAD"
          ? "بيانات الطلب غير صحيحة"
          : raw === "PLACE_ORDER_NO_ID"
            ? "الطلب اتعمل بس معرف الأوردر مرجعش — تواصلي مع الدعم"
            : normalized.includes("no longer available") ||
                normalized.includes("could not be found")
              ? "منتج أو أكثر في السلة مش متاح دلوقتي"
              : normalized.includes("authenticated")
                ? "لازم تكوني مسجّلة الدخول عشان تتمّي الطلب"
                : raw || "حصل خطأ أثناء إتمام الطلب، جرّبي تاني";
      toast.error(message);
    },
  });
}
