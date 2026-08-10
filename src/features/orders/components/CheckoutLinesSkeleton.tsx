import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CheckoutLinesSkeletonProps = {
  count?: number;
  className?: string;
};

export default function CheckoutLinesSkeleton({
  count = 2,
  className,
}: CheckoutLinesSkeletonProps) {
  return (
    <div
      className={cn("flex flex-col", className)}
      aria-busy="true"
      aria-label="جاري تحميل المنتجات"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex gap-4 border-b border-border py-5 last:border-b-0 sm:gap-5"
        >
          <Skeleton className="size-20 shrink-0 rounded-2xl sm:size-24" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-auto h-5 w-20 self-end" />
          </div>
        </div>
      ))}
    </div>
  );
}
