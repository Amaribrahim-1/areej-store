import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getFeaturedProducts, getLatestProducts } from "@/features/products/api/getProducts";
import {
  featuredProductsQueryKey,
  latestProductsQueryKey,
} from "@/features/products/api/queryKeys";
import FeaturedProducts from "@/features/products/components/FeaturedProducts";
import LatestProducts from "@/features/products/components/LatestProducts";
import {
  HOME_FEATURED_PAGE_SIZE,
  HOME_LATEST_PAGE_SIZE,
} from "@/features/products/constants";
import { getHomeTestimonials } from "@/features/reviews/api/getHomeTestimonials";
import { homeTestimonialsQueryKey } from "@/features/reviews/api/queryKeys";
import HomeTestimonials from "@/features/reviews/components/home/HomeTestimonials";
import { HOME_TESTIMONIALS_PAGE_SIZE } from "@/features/reviews/constants";
import {
  createPrefetchQueryClient,
  prefetchQuerySafe,
} from "@/lib/query/prefetch";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site";
import { createClient as createServerClient } from "@/lib/supabase/server";

import Features from "./_components/Features";
import Hero from "./_components/Hero";

export const metadata: Metadata = {
  title: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default async function Home() {
  const queryClient = createPrefetchQueryClient();
  const supabase = await createServerClient();

  await Promise.all([
    prefetchQuerySafe(queryClient, {
      queryKey: latestProductsQueryKey(HOME_LATEST_PAGE_SIZE),
      queryFn: () =>
        getLatestProducts({ pageSize: HOME_LATEST_PAGE_SIZE }, supabase),
    }),
    prefetchQuerySafe(queryClient, {
      queryKey: featuredProductsQueryKey(HOME_FEATURED_PAGE_SIZE),
      queryFn: () =>
        getFeaturedProducts({ pageSize: HOME_FEATURED_PAGE_SIZE }, supabase),
    }),
    prefetchQuerySafe(queryClient, {
      queryKey: homeTestimonialsQueryKey(HOME_TESTIMONIALS_PAGE_SIZE),
      queryFn: () =>
        getHomeTestimonials({ pageSize: HOME_TESTIMONIALS_PAGE_SIZE }, supabase),
    }),
  ]);

  return (
    <>
      <Hero />
      <Features />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LatestProducts />
        <FeaturedProducts />
        <HomeTestimonials />
      </HydrationBoundary>
    </>
  );
}
