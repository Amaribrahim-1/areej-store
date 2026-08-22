import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  PRODUCT_STATUS_LABELS,
  type ProductStatus,
} from "../../constants";

type AdminProductStatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

const STATUS_BADGE_CLASS: Record<ProductStatus, string> = {
  active: "border-transparent bg-brand-100 text-brand-800",
  inactive: "border-transparent bg-muted text-muted-foreground",
};

export default function AdminProductStatusBadge({
  status,
  className,
}: AdminProductStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_BADGE_CLASS[status], className)}
    >
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}
