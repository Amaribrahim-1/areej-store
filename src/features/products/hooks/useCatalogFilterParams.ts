import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const selectedCategory = categoryRaw;

  const ratingRaw = searchParams.get("minRating") ?? "";
  const selectedRating = VALID_RATINGS.has(ratingRaw) ? ratingRaw : "";

  const sortingRow = searchParams.get("sort") ?? "";
  const selectedSorting = VALID_SORTING.has(sortingRow) ? sortingRow : "newest";

  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const searchValue = searchParams.get("search") ?? "";

  const pageRaw = searchParams.get("page");
  const parsedPage = Number.parseInt(pageRaw ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  function updateFilterParam(key: string, value: string) {
    setFilterParams({ [key]: value });
  }

  function setFilterParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    if (!("page" in updates)) {
      params.delete("page");
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function setPage(nextPage: number) {
    const safe = Number.isFinite(nextPage) && nextPage > 0 ? nextPage : 1;
    setFilterParams({ page: safe <= 1 ? "" : String(safe) });
  }

  function removeFilters() {
    router.replace(pathname, { scroll: false });
  }

  const hasActiveFilters = Boolean(
    selectedCategory ||
      selectedRating ||
      minPrice ||
      maxPrice ||
      searchValue,
  );

  return {
    selectedCategory,
    selectedRating,
    selectedSorting,
    minPrice,
    maxPrice,
    page,
    setPage,
    updateFilterParam,
    setFilterParams,
    removeFilters,
    searchValue,
    hasActiveFilters,
  };
}
