"use client";

import Link from "next/link";
import { PercentIcon } from "lucide-react";

import { ProductGridSkeleton } from "@/components/shared/ContentSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useFeaturedProducts } from "../api/useFeaturedProducts";
import { HOME_FEATURED_PAGE_SIZE } from "../constants";
import ProductCard from "./ProductCard";

const FEATURED_GRID_CLASS =
  "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4";

export default function FeaturedProducts() {
  const { data, isPending, isError, refetch } = useFeaturedProducts({
    pageSize: HOME_FEATURED_PAGE_SIZE,
  });

  return (
    <section
      aria-labelledby="home-featured-heading"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
        <header className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <h2
            id="home-featured-heading"
            className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-3xl"
          >
            العروض
          </h2>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "link" }),
              "inline-flex min-h-11 items-center",
            )}
          >
            تسوّقي المنتجات
          </Link>
        </header>

        {isPending ? (
          <ProductGridSkeleton
            count={HOME_FEATURED_PAGE_SIZE}
            className={FEATURED_GRID_CLASS}
          />
        ) : isError ? (
          <ErrorState
            title="فشل تحميل العروض"
            description="تعذّر جلب المنتجات المخفّضة. حاولي مرة أخرى."
            onRetry={() => refetch()}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<PercentIcon />}
            title="لا توجد عروض حالياً"
            titleAs="p"
            description="لما يتضاف خصم على منتج، هيظهر هنا."
          />
        ) : (
          <ul className={cn("list-none", FEATURED_GRID_CLASS)}>
            {data.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
