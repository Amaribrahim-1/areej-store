import type { Metadata } from "next";
import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { ProductGridSkeleton } from "@/components/shared/ContentSkeleton";
import { getCategories } from "@/features/products/api/getCategories";
import { getProducts } from "@/features/products/api/getProducts";
import {
  categoriesQueryKey,
  productsQueryKey,
} from "@/features/products/api/queryKeys";
import ProductCatalog from "@/features/products/components/ProductCatalog";
import ProductGrid from "@/features/products/components/ProductGrid";
import { PRODUCTS_PAGE_SIZE } from "@/features/products/constants";
import { catalogProductsParamsFromSearchParams } from "@/features/products/lib/catalogProductsParams";
import {
  createPrefetchQueryClient,
  prefetchQuerySafe,
} from "@/lib/query/prefetch";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "المنتجات",
  description: "تصفّح مجموعة عطور ومسك ومخمريات زيوت الشعر من أريج.",
  alternates: { canonical: "/products" },
  openGraph: { url: "/products" },
};

type ProductsCatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsCatalogPage({
  searchParams,
}: ProductsCatalogPageProps) {
  const queryClient = createPrefetchQueryClient();
  const [params, supabase] = await Promise.all([
    searchParams,
    createServerClient(),
  ]);
  const catalogParams = catalogProductsParamsFromSearchParams(params);

  await Promise.all([
    prefetchQuerySafe(queryClient, {
      queryKey: productsQueryKey(catalogParams),
      queryFn: () => getProducts(catalogParams, supabase),
    }),
    prefetchQuerySafe(queryClient, {
      queryKey: categoriesQueryKey(),
      queryFn: () => getCategories(supabase),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 space-y-2 text-start sm:mb-10">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            المنتجات
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            تصفّح مجموعة عطور ومسك ومخمريات زيوت الشعر من أريج.
          </p>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={PRODUCTS_PAGE_SIZE} />}>
          <ProductCatalog>
            <ProductGrid />
          </ProductCatalog>
        </Suspense>
      </section>
    </HydrationBoundary>
  );
}
