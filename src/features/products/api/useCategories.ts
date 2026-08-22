"use client";

import { useQuery } from "@tanstack/react-query";

import { CATEGORIES_STALE_TIME_MS } from "../constants";
import { getCategories } from "./getCategories";
import { categoriesQueryKey } from "./queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey(),
    queryFn: getCategories,
    staleTime: CATEGORIES_STALE_TIME_MS,
  });
}
