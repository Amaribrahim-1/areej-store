"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { placeOrder, type PlaceOrderInput } from "./placeOrder";
import { customerOrdersQueryKey } from "./useCustomerOrders";

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerOrdersQueryKey() });
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
