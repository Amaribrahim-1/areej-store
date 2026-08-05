"use client";

import { FilterIcon, SearchIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import CatalogFiltersPanel from "./CatalogFiltersPanel";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
  { value: "rating-desc", label: "الأعلى تقييماً" },
] as const;

const selectClassName = cn(
  "h-9 min-w-0 rounded-4xl border border-input bg-background px-3 text-sm",
  "text-foreground outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

type ProductCatalogProps = {
  children: ReactNode;
};

/**
 * Catalog page shell: search + sidebar filters + toolbar.
 * UI only — no URL / useProducts wiring yet (your 3.6 / 3.7 logic).
 */
export default function ProductCatalog({ children }: ProductCatalogProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="catalog-search"
          name="search"
          type="search"
          placeholder="ابحث عن عطر، مسك..."
          className="h-11 bg-background pe-3 ps-10"
          aria-label="بحث في المنتجات"
        />
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="hidden w-56 shrink-0 md:block lg:w-64">
          <CatalogFiltersPanel idPrefix="catalog-desktop" />
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="md:hidden"
                  />
                }
              >
                <FilterIcon className="size-4" aria-hidden />
                تصفية
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100%,20rem)] p-0">
                <SheetHeader className="border-b border-border px-4 py-4 text-start">
                  <SheetTitle className="font-heading text-brand">
                    تصفية المنتجات
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto p-4">
                  <CatalogFiltersPanel idPrefix="catalog-mobile" />
                </div>
              </SheetContent>
            </Sheet>

            <div className="ms-auto flex items-center gap-2">
              <Label htmlFor="catalog-sort" className="sr-only">
                الترتيب
              </Label>
              <select
                id="catalog-sort"
                name="sort"
                className={cn(selectClassName, "w-auto max-w-[12rem]")}
                defaultValue="newest"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
