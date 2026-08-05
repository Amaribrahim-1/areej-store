"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from "../constants";

const RATING_OPTIONS = [
  { value: "", label: "الكل" },
  { value: "3", label: "من 3 نجوم" },
  { value: "4", label: "من 4 نجوم" },
  { value: "5", label: "من 5 نجوم" },
] as const;

const VALID_RATINGS = new Set(["3", "4", "5"]);

const selectClassName = cn(
  "h-9 w-full min-w-0 rounded-4xl border border-input bg-background px-3 text-sm",
  "text-foreground outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

const radioClassName = cn(
  "size-4 shrink-0 border border-border text-brand-500",
  "accent-brand-700 focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

type CatalogFiltersPanelProps = {
  className?: string;
  /** Prefix ids when the panel is rendered twice (desktop + mobile sheet). */
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

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryRaw = searchParams.get("category") ?? "";
  const selectedCategory = PRODUCT_CATEGORIES.includes(
    categoryRaw as (typeof PRODUCT_CATEGORIES)[number],
  )
    ? categoryRaw
    : "";

  const ratingRaw = searchParams.get("minRating") ?? "";
  const selectedRating = VALID_RATINGS.has(ratingRaw) ? ratingRaw : "";

  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  function updateFilterParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    params.delete("page");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function removeFilters() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className={cn("space-y-8 text-start", className)}>
      <div>
        <h2 className="font-heading text-lg font-semibold text-brand-800">
          تسوق المنتجات
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 border-border-accent text-text-accent hover:bg-brand-50"
          onClick={removeFilters}
        >
          مسح الفلاتر
        </Button>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">الأقسام</legend>
        <ul className="space-y-2.5">
          <li>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/80">
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
          {PRODUCT_CATEGORIES.map((category) => (
            <li key={category}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/80">
                <input
                  type="radio"
                  name={categoryGroupName}
                  value={category}
                  className={radioClassName}
                  checked={selectedCategory === category}
                  onChange={(e) =>
                    updateFilterParam("category", e.target.value)
                  }
                />
                {PRODUCT_CATEGORY_LABELS[category]}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">السعر (ج.م)</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
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
              className="bg-background"
              value={minPrice}
              onChange={(e) => updateFilterParam("minPrice", e.target.value)}
            />
          </div>
          <span className="text-muted-foreground" aria-hidden>
            —
          </span>
          <div className="flex-1 space-y-1">
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
              className="bg-background"
              value={maxPrice}
              onChange={(e) => updateFilterParam("maxPrice", e.target.value)}
            />
          </div>
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
