import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PRODUCT_CATEGORIES } from "../constants";

const VALID_RATINGS = new Set(["3", "4", "5"]);
const VALID_SORTING = new Set([
  "newest",
  "price-asc",
  "price-desc",
  "rating-desc",
]);

export default function useCatalogFilterParams() {
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

  const sortingRow = searchParams.get("sort") ?? "";
  const selectedSorting = VALID_SORTING.has(sortingRow) ? sortingRow : "newest";

  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const searchValue = searchParams.get("search") ?? "";

  function updateFilterParam(key: string, value: string) {
    setFilterParams({ [key]: value });
  }

  /** Set multiple query keys in one replace (e.g. minPrice + maxPrice together). */
  function setFilterParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    params.delete("page");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function removeFilters() {
    router.replace(pathname, { scroll: false });
  }

  return {
    selectedCategory,
    selectedRating,
    selectedSorting,
    minPrice,
    maxPrice,
    updateFilterParam,
    setFilterParams,
    removeFilters,
    searchValue,
  };
}
