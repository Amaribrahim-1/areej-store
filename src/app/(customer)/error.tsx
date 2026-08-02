"use client";

import ErrorState from "@/components/shared/ErrorState";

export default function CustomerError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="حدث خطأ في الصفحة"
      description="حصل مشكلة أثناء عرض الصفحة. جرّب إعادة المحاولة، أو ارجع لاحقًا."
      onRetry={reset}
      className="min-h-[50vh]"
    />
  );
}
