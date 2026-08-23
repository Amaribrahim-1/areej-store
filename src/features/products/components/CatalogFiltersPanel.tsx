"use client";

import { useEffect, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useCategories } from "../api/useCategories";
import useCatalogFilterParams from "../hooks/useCatalogFilterParams";

const RATING_OPTIONS = [
  { value: "", label: "الكل" },
  { value: "3", label: "من 3 نجوم" },
  { value: "4", label: "من 4 نجوم" },
  { value: "5", label: "من 5 نجوم" },
] as const;

const selectClassName = cn(
  "h-11 w-full min-w-0 rounded-4xl border border-input bg-background px-3 text-base",
  "text-foreground outline-none transition-colors md:h-9 md:text-sm",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

const radioClassName = cn(
  "size-4 shrink-0 border border-border text-brand-500",
  "accent-brand-700 focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

const categoryLabelClassName =
  "flex min-h-11 cursor-pointer items-center gap-2.5 py-2 text-sm text-foreground/80 md:min-h-0 md:py-1";

type CatalogFiltersPanelProps = {
  className?: string;
  idPrefix?: string;
};

export default function CatalogFiltersPanel({
  className,
  idPrefix = "catalog",
}: CatalogFiltersPanelProps) {
  const ratingId = `${idPrefix}-rating`;
  const minPriceId = `${idPrefix}-min-price`;
  const maxPriceId = `${idPrefix}-max-price`;
  const categoryGroupName = `${idPrefix}-category`;

  const {
    selectedCategory,
    selectedRating,
    minPrice,
    maxPrice,
    updateFilterParam,
    setFilterParams,
    removeFilters,
  } = useCatalogFilterParams();
  const { data: categories = [], isPending, isError, refetch } =
    useCategories();

  const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);

  useEffect(() => {
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  function applyPriceFilters() {
    if (draftMinPrice === minPrice && draftMaxPrice === maxPrice) return;
    setFilterParams({
      minPrice: draftMinPrice,
      maxPrice: draftMaxPrice,
    });
  }

  function handleCategoryChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilterParam("category", event.target.value);
  }

  return (
    <div className={cn("space-y-8 text-start", className)}>
      <div>
        <h2 className="font-heading text-lg font-semibold text-brand-800">
          تسوّقي المنتجات
        </h2>
        <Button
          type="button"
          variant="outline"
          className="mt-2 min-h-11 border-border-accent text-text-accent hover:bg-brand-50"
          onClick={removeFilters}
        >
          مسح الفلاتر
        </Button>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">الأقسام</legend>
        {isPending ? (
          <ul
            className="space-y-1 md:space-y-0.5"
            aria-busy="true"
            aria-label="جاري تحميل الأقسام"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-11 w-full rounded-2xl md:h-8" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-1 md:space-y-0.5">
            <li>
              <label className={categoryLabelClassName}>
                <input
                  type="radio"
                  name={categoryGroupName}
                  value=""
                  className={radioClassName}
                  checked={selectedCategory === ""}
                  onChange={() => updateFilterParam("category", "")}
                />
                الكل
              </label>
            </li>
            {isError ? (
              <li>
                <p className="text-sm text-destructive" role="alert">
                  تعذّر تحميل الأقسام.{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4"
                    onClick={() => refetch()}
                  >
                    إعادة المحاولة
                  </button>
                </p>
              </li>
            ) : null}
            {!isError && categories.length === 0 ? (
              <li>
                <p className="text-sm text-muted-foreground">
                  لا توجد أقسام بعد.
                </p>
              </li>
            ) : null}
            {!isError
              ? categories.map((category) => (
                  <li key={category.slug}>
                    <label className={categoryLabelClassName}>
                      <input
                        type="radio"
                        name={categoryGroupName}
                        value={category.slug}
                        className={radioClassName}
                        checked={selectedCategory === category.slug}
                        onChange={handleCategoryChange}
                      />
                      {category.label}
                    </label>
                  </li>
                ))
              : null}
          </ul>
        )}
      </fieldset>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">السعر (ج.م)</p>
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1">
              <Label htmlFor={minPriceId} className="sr-only">
                من
              </Label>
              <Input
                id={minPriceId}
                name="minPrice"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="من"
                className="bg-background text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={draftMinPrice}
                onChange={(e) => setDraftMinPrice(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyPriceFilters();
                }}
              />
            </div>
            <span className="shrink-0 text-muted-foreground" aria-hidden>
              —
            </span>
            <div className="min-w-0 flex-1">
              <Label htmlFor={maxPriceId} className="sr-only">
                إلى
              </Label>
              <Input
                id={maxPriceId}
                name="maxPrice"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="إلى"
                className="bg-background text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyPriceFilters();
                }}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="min-h-11 w-full"
            onClick={applyPriceFilters}
          >
            تطبيق
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={ratingId} className="text-sm font-medium">
          التقييم
        </Label>
        <select
          id={ratingId}
          name="minRating"
          className={selectClassName}
          value={selectedRating}
          onChange={(e) => updateFilterParam("minRating", e.target.value)}
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
