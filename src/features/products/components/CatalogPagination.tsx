"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CatalogPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function CatalogPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  function goPrevious() {
    if (atStart) return;
    onPageChange(page - 1);
  }

  function goNext() {
    if (atEnd) return;
    onPageChange(page + 1);
  }

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-3", className)}
      aria-label="ترقيم صفحات المنتجات"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={goPrevious}
        disabled={atStart}
      >
        السابق
      </Button>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        صفحة {page} من {totalPages}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={goNext}
        disabled={atEnd}
      >
        التالي
      </Button>
    </nav>
  );
}
