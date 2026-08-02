"use client";

import ErrorState from "@/components/shared/ErrorState";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="حدث خطأ في لوحة التحكم"
      description="تعذّر تحميل هذه الصفحة. جرّب إعادة المحاولة."
      onRetry={reset}
      className="min-h-[50vh]"
    />
  );
}
