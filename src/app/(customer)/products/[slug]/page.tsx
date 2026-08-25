import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { getProduct } from "@/features/products/api/getProduct";
import { productQueryKey } from "@/features/products/api/queryKeys";
import ProductDetails from "@/features/products/components/ProductDetails";
import { decodeRouteSlug } from "@/features/products/lib/decodeRouteSlug";
import { getProductReviews } from "@/features/reviews/api/getProductReviews";
import { productReviewsQueryKey } from "@/features/reviews/api/queryKeys";
import {
  createPrefetchQueryClient,
  prefetchQuerySafe,
} from "@/lib/query/prefetch";
import { storefrontOpenGraph, storefrontTwitter } from "@/lib/seo";
import { createClient as createServerClient } from "@/lib/supabase/server";

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeRouteSlug(rawSlug);
  const product = await getProduct({ slug });

  if (!product) {
    return { title: "المنتج غير موجود" };
  }

  const description =
    product.description?.trim() ||
    `تسوّقي ${product.name} من ${product.categoryLabel} — متجر أريج للعطور.`;
  const url = `/products/${encodeURIComponent(product.slug)}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...storefrontOpenGraph({ url, title: product.name, description }),
      images: [{ url: product.imageUrl, alt: `صورة ${product.name}` }],
    },
    twitter: {
      ...storefrontTwitter({ title: product.name, description }),
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const queryClient = createPrefetchQueryClient();
  const [{ slug: rawSlug }, initialUser, supabase] = await Promise.all([
    params,
    getCurrentUser(),
    createServerClient(),
  ]);
  const slug = decodeRouteSlug(rawSlug);
  const productParams = { slug };

  await Promise.all([
    prefetchQuerySafe(queryClient, {
      queryKey: productQueryKey(productParams),
      queryFn: () => getProduct(productParams, supabase),
    }),
    prefetchQuerySafe(queryClient, {
      queryKey: productReviewsQueryKey(productParams),
      queryFn: () => getProductReviews(productParams, supabase),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <ProductDetails slug={slug} initialUser={initialUser} />
      </section>
    </HydrationBoundary>
  );
}
