import { Skeleton } from "@/components/ui/skeleton";

export default function ProductReviewsSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="جاري تحميل التقييمات"
    >
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="flex gap-3 sm:gap-4">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
