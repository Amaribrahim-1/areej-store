"use client";

import { useQuery } from "@tanstack/react-query";

import {
  HOME_TESTIMONIALS_PAGE_SIZE,
  PRODUCT_REVIEWS_STALE_TIME_MS,
} from "../constants";
import type { HomeTestimonialsParams } from "../types";
import { getHomeTestimonials } from "./getHomeTestimonials";

export function homeTestimonialsQueryKey(pageSize: number) {
  return ["home-testimonials", { pageSize }] as const;
}

export function useHomeTestimonials(params: HomeTestimonialsParams = {}) {
  const pageSize = params.pageSize ?? HOME_TESTIMONIALS_PAGE_SIZE;

  return useQuery({
    queryKey: homeTestimonialsQueryKey(pageSize),
    queryFn: () => getHomeTestimonials({ pageSize }),
    staleTime: PRODUCT_REVIEWS_STALE_TIME_MS,
  });
}
