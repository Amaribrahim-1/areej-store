"use client";

import { useQuery } from "@tanstack/react-query";

import {
  HOME_TESTIMONIALS_PAGE_SIZE,
  PRODUCT_REVIEWS_STALE_TIME_MS,
} from "../constants";
import type { HomeTestimonialsParams } from "../types";
import { getHomeTestimonials } from "./getHomeTestimonials";
import { homeTestimonialsQueryKey } from "./queryKeys";

export { homeTestimonialsQueryKey } from "./queryKeys";

export function useHomeTestimonials(params: HomeTestimonialsParams = {}) {
  const pageSize = params.pageSize ?? HOME_TESTIMONIALS_PAGE_SIZE;

  return useQuery({
    queryKey: homeTestimonialsQueryKey(pageSize),
    queryFn: () => getHomeTestimonials({ pageSize }),
    staleTime: PRODUCT_REVIEWS_STALE_TIME_MS,
  });
}
