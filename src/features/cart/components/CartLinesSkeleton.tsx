"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CartLinesSkeletonProps = {
  count?: number;
  className?: string;
};

export default function CartLinesSkeleton({
  count = 3,
  className,
}: CartLinesSkeletonProps) {
  return (
    <div
      className={cn("flex flex-col", className)}
      aria-busy="true"
      aria-label="جاري تحميل السلة"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex gap-4 border-b border-border py-5 last:border-b-0 sm:gap-5"
        >
          <Skeleton className="size-24 shrink-0 rounded-2xl sm:size-28" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="size-8 shrink-0 rounded-full" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-11 w-full rounded-4xl sm:w-36" />
              <Skeleton className="h-6 w-20 self-end sm:self-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
