"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  adminOrderQueryKey,
  adminOrdersQueryKey,
  customerOrdersQueryKey,
} from "../queryKeys";
import type { AdminOrder, AdminOrderDetail } from "../../types";
import {
  updateAdminOrderStatus,
  type UpdateAdminOrderStatusInput,
} from "./updateAdminOrderStatus";

type StatusUpdateContext = {
  previousDetail: AdminOrderDetail | undefined;
  previousList: AdminOrder[] | undefined;
};

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAdminOrderStatusInput) =>
      updateAdminOrderStatus(input),
    onMutate: async (input): Promise<StatusUpdateContext> => {
      const detailKey = adminOrderQueryKey(input.orderId);
      const listKey = adminOrdersQueryKey();

      await Promise.all([
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: listKey }),
      ]);

      const previousDetail =
        queryClient.getQueryData<AdminOrderDetail>(detailKey);
      const previousList = queryClient.getQueryData<AdminOrder[]>(listKey);

      if (previousDetail) {
        queryClient.setQueryData<AdminOrderDetail>(detailKey, {
          ...previousDetail,
          status: input.status,
        });
      }

      if (previousList) {
        queryClient.setQueryData<AdminOrder[]>(
          listKey,
          previousList.map((order) =>
            order.id === input.orderId
              ? { ...order, status: input.status }
              : order,
          ),
        );
      }

      return { previousDetail, previousList };
    },
    onError: (error, input, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          adminOrderQueryKey(input.orderId),
          context.previousDetail,
        );
      }
      if (context?.previousList) {
        queryClient.setQueryData(adminOrdersQueryKey(), context.previousList);
      }

      const raw = error instanceof Error ? error.message : "";
      const message =
        raw === "INVALID_ORDER_STATUS_PAYLOAD"
          ? "حالة الطلب غير صحيحة"
          : raw === "UNAUTHENTICATED"
            ? "جلسة الأدمن انتهت. سجّل الدخول مرة أخرى"
            : raw === "ORDER_NOT_FOUND"
              ? "الطلب غير موجود أو لا يمكن تحديثه"
              : raw || "تعذر تحديث حالة الطلب. جرّب مرة أخرى";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("تم تحديث حالة الطلب");
    },
    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({
        queryKey: adminOrderQueryKey(input.orderId),
      });
      queryClient.invalidateQueries({ queryKey: adminOrdersQueryKey() });
      queryClient.invalidateQueries({ queryKey: customerOrdersQueryKey() });
    },
  });
}
