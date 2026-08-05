"use client";

import Image from "next/image";
import { PackageXIcon } from "lucide-react";

import PriceTag from "@/components/shared/PriceTag";
import StarRating from "@/components/shared/StarRating";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { useProduct } from "../api/useProduct";
import { PRODUCT_CATEGORY_LABELS } from "../constants";

type ProductDetailsProps = {
  slug: string;
};

export default function ProductDetails({ slug }: ProductDetailsProps) {
  const { data: product, isLoading, isError, refetch } = useProduct({ slug });

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (!product) {
    return (
      <EmptyState
        icon={<PackageXIcon />}
        title="المنتج غير موجود"
        description="عذراً، المنتج الذي تبحث عنه غير موجود أو تم إخفاؤه."
        className="min-h-[50vh]"
      />
    );
  }

  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category];
  // Phase 3.8: Use the first variant as the default displayed price.
  // The variant selector will be built in Phase 3.9 to change this.
  const displayVariant = product.variants[0];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-brand-50">
        <Image
          src={product.imageUrl}
          alt={`صورة ${product.name}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-6 py-4">
        <div className="space-y-4">
          <Badge
            variant="secondary"
            className="bg-brand-100 px-3 py-1 text-sm text-brand-800 hover:bg-brand-100"
          >
            {categoryLabel}
          </Badge>

          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            {product.averageRating !== null ? (
              <>
                <StarRating value={product.averageRating} size="md" />
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} تقييم)
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                لا توجد تقييمات بعد
              </span>
            )}
          </div>

          <div className="pt-2">
            <PriceTag
              currentPrice={displayVariant.currentPrice}
              originalPrice={displayVariant.originalPrice}
              size="lg"
            />
          </div>
        </div>

        {product.description ? (
          <div className="space-y-2 border-t border-border pt-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              وصف المنتج
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        ) : null}

        {/* Placeholders for Future Tasks */}
        {/* <div className="mt-4 border-t border-border pt-6">
           variant selector (3.9) and Add to cart (3.10) will go here
        </div> */}
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="flex flex-col gap-6 py-4">
        <div className="space-y-4">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <div className="pt-2">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="space-y-3 border-t border-border pt-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
