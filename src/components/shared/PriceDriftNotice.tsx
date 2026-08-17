import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PriceDriftNoticeProps = {
  className?: string;
};

/** Shared by the cart page and checkout review step (task 4.4). */
export default function PriceDriftNotice({ className }: PriceDriftNoticeProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-2xl border border-border bg-brand-50 px-4 py-3 text-sm text-foreground",
        className,
      )}
    >
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden />
      <p>تم تحديث أسعار بعض المنتجات في السلة وفقًا لأحدث سعر متاح.</p>
    </div>
  );
}
