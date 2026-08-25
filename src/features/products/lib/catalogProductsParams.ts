import { PRODUCTS_PAGE_SIZE } from "../constants";
import type { ProductSort, ProductsQueryParams } from "../types";

const VALID_RATINGS = new Set(["3", "4", "5"]);
const VALID_SORTING = new Set<string>([
  "newest",
  "price-asc",
  "price-desc",
  "rating-desc",
]);

function toOptionalNumber(raw: string): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function firstSearchParam(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** Same object `ProductGrid` passes to `useProducts` — keeps query keys aligned. */
export function toCatalogProductsQueryParams(input: {
  page: number;
  category: string;
  minRating: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  search: string;
}): ProductsQueryParams {
  const minRating = toOptionalNumber(input.minRating);
  const minPrice = toOptionalNumber(input.minPrice);
  const maxPrice = toOptionalNumber(input.maxPrice);
  const sort = VALID_SORTING.has(input.sort)
    ? (input.sort as ProductSort)
    : "newest";

  return {
    page: input.page,
    pageSize: PRODUCTS_PAGE_SIZE,
    sort,
    search: input.search,
    ...(input.category ? { category: input.category } : {}),
    ...(minRating !== undefined ? { minRating } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
  };
}

export function catalogProductsParamsFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProductsQueryParams {
  const ratingRaw = firstSearchParam(searchParams.minRating);
  const sortRaw = firstSearchParam(searchParams.sort);
  const pageRaw = firstSearchParam(searchParams.page);
  const parsedPage = Number.parseInt(pageRaw || "1", 10);

  return toCatalogProductsQueryParams({
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    category: firstSearchParam(searchParams.category),
    minRating: VALID_RATINGS.has(ratingRaw) ? ratingRaw : "",
    minPrice: firstSearchParam(searchParams.minPrice),
    maxPrice: firstSearchParam(searchParams.maxPrice),
    sort: VALID_SORTING.has(sortRaw) ? sortRaw : "newest",
    search: firstSearchParam(searchParams.search),
  });
}
