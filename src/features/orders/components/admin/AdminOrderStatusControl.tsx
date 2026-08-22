"use client";

import type { ChangeEvent } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useUpdateAdminOrderStatus } from "../../api/admin/useUpdateAdminOrderStatus";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  type OrderStatus,
} from "../../constants";
import { updateAdminOrderStatusSchema } from "../../schema";

const selectClassName = cn(
  "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 text-sm sm:w-48",
  "text-foreground outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type AdminOrderStatusControlProps = {
  orderId: string;
  status: OrderStatus;
};

export default function AdminOrderStatusControl({
  orderId,
  status,
}: AdminOrderStatusControlProps) {
  const { mutate, isPending, variables } = useUpdateAdminOrderStatus();
  const displayedStatus =
    isPending && variables?.orderId === orderId ? variables.status : status;

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const parsed = updateAdminOrderStatusSchema.safeParse({
      orderId,
      status: event.target.value,
    });

    if (!parsed.success || parsed.data.status === displayedStatus) {
      return;
    }

    mutate(parsed.data);
  }

  return (
    <div className="space-y-2 sm:min-w-48">
      <Label htmlFor="admin-order-status">حالة الطلب</Label>
      <select
        id="admin-order-status"
        className={selectClassName}
        value={displayedStatus}
        disabled={isPending}
        aria-busy={isPending}
        onChange={handleStatusChange}
      >
        {ORDER_STATUSES.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
    </div>
  );
}
