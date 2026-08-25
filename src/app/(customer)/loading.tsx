import { ProductGridSkeleton } from "@/components/shared/ContentSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div
        className="mb-8 h-0.5 overflow-hidden rounded-full bg-brand-100"
        aria-hidden
      >
        <div className="h-full w-1/3 animate-pulse bg-brand" />
      </div>
      <div className="mb-8 space-y-3" aria-busy="true" aria-label="جاري التحميل">
        <Skeleton className="h-9 w-48 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
