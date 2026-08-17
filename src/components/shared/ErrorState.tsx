import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export default function ErrorState({
  title = "حدث خطأ ما",
  description = "تعذّر تحميل المحتوى. حاولي مرة أخرى.",
  onRetry,
  retryLabel = "إعادة المحاولة",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <AlertCircleIcon
        className="size-10 text-destructive"
        aria-hidden
      />
      <div className="space-y-1.5">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry} className="mt-1">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
