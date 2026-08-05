import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ContentSkeletonProps = {
  className?: string;
};

export function ProductCardSkeleton({ className }: ContentSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

type ProductGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ListSkeleton({
  count = 5,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-2xl" />
      ))}
    </div>
  );
}
