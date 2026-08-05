"use client";

import { FilterIcon, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
import useCatalogFilterParams from "../hooks/useCatalogFilterParams";

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

export default function ProductCatalog({ children }: ProductCatalogProps) {
  const { selectedSorting, updateFilterParam, searchValue } =
    useCatalogFilterParams();
  const [draftSearch, setDraftSearch] = useState(searchValue);
  /** Skip URL→draft sync once after we wrote the URL ourselves (avoids clobbering fast typing). */
  const skipNextUrlSyncRef = useRef(false);

  useEffect(() => {
    if (skipNextUrlSyncRef.current) {
      skipNextUrlSyncRef.current = false;
      return;
    }
    setDraftSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const id = setTimeout(() => {
      const next = draftSearch.trim();
      if (next === searchValue.trim()) return;
      skipNextUrlSyncRef.current = true;
      updateFilterParam("search", next);
    }, 400);

    return () => clearTimeout(id);
  }, [draftSearch, searchValue, updateFilterParam]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Label htmlFor="catalog-search" className="sr-only">
          بحث في المنتجات
        </Label>
        <Input
          id="catalog-search"
          name="search"
          type="search"
          placeholder="ابحث عن عطر، مسك..."
          className="h-11 bg-background pe-3 ps-10"
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
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
                value={selectedSorting}
                onChange={(e) => updateFilterParam("sort", e.target.value)}
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
