import type { ChangeEvent } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  ADMIN_ORDER_SORT_LABELS,
  ADMIN_ORDER_SORTS,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  type AdminOrderSort,
  type OrderStatus,
} from "../../constants";

const selectClassName = cn(
  "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 text-sm sm:w-48",
  "text-foreground outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

type AdminOrdersToolbarProps = {
  selectedStatus: OrderStatus | undefined;
  selectedSort: AdminOrderSort;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function AdminOrdersToolbar({
  selectedStatus,
  selectedSort,
  onStatusChange,
  onSortChange,
}: AdminOrdersToolbarProps) {
  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onStatusChange(event.target.value);
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    onSortChange(event.target.value);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="space-y-2 sm:min-w-48">
        <Label htmlFor="admin-orders-status-filter">الحالة</Label>
        <select
          id="admin-orders-status-filter"
          name="status"
          className={selectClassName}
          value={selectedStatus ?? ""}
          onChange={handleStatusChange}
        >
          <option value="">الكل</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {ORDER_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 sm:min-w-48">
        <Label htmlFor="admin-orders-sort">الترتيب</Label>
        <select
          id="admin-orders-sort"
          name="sort"
          className={selectClassName}
          value={selectedSort}
          onChange={handleSortChange}
        >
          {ADMIN_ORDER_SORTS.map((value) => (
            <option key={value} value={value}>
              {ADMIN_ORDER_SORT_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
