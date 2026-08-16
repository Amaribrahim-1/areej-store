import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { HOME_TESTIMONIALS_PAGE_SIZE } from "../../constants";

type HomeTestimonialsSkeletonProps = {
  count?: number;
  className?: string;
};

export default function HomeTestimonialsSkeleton({
  count = HOME_TESTIMONIALS_PAGE_SIZE,
  className,
}: HomeTestimonialsSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4",
        className,
      )}
      aria-busy="true"
      aria-label="جاري تحميل آراء العملاء"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl p-5 ring-1 ring-foreground/10"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
