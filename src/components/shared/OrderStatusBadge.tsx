import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/features/orders/constants";

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  Pending: "border-transparent bg-brand-100 text-brand-800",
  Shipping: "border-transparent bg-primary text-primary-foreground",
  Delivered: "border-transparent bg-brand-50 text-brand-700",
  Cancelled:
    "border-transparent bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_BADGE_CLASS[status], className)}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
