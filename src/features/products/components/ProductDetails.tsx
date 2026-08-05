"use client";

import { useState } from "react";
import Image from "next/image";
import { PackageXIcon, ShoppingCartIcon } from "lucide-react";

import PriceTag, { formatPrice } from "@/components/shared/PriceTag";
import StarRating from "@/components/shared/StarRating";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductReviewsList from "@/features/reviews/components/product/ProductReviewsList";

import { useProduct } from "../api/useProduct";
import { PRODUCT_CATEGORY_LABELS } from "../constants";
import { resolveDisplayVariant } from "../lib/resolveDisplayVariant";
import type { ProductDetail } from "../types";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";

type ProductDetailsProps = {
  slug: string;
};

export default function ProductDetails({ slug }: ProductDetailsProps) {
  // Both queries keyed by slug and start on mount — ProductReviewsList stays
  // mounted during product loading so reviews are not gated behind product (3.11).
  const { data: product, isLoading, isError, refetch } = useProduct({ slug });

  return (
    <>
      {isLoading ? <ProductDetailsSkeleton /> : null}

      {!isLoading && isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : null}

      {!isLoading && !isError && !product ? (
        <EmptyState
          icon={<PackageXIcon />}
          title="المنتج غير موجود"
          description="عذراً، المنتج الذي تبحث عنه غير موجود أو تم إخفاؤه."
          className="min-h-[50vh]"
        />
      ) : null}

      {!isLoading && !isError && product ? (
        <ProductDetailsContent product={product} />
      ) : null}

      <ProductReviewsList slug={slug} />
    </>
  );
}

type ProductDetailsContentProps = {
  product: ProductDetail;
};

function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id,
  );
  const [quantity, setQuantity] = useState(1);

  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category];
  const displayVariant = resolveDisplayVariant(
    product.variants,
    selectedVariantId,
  );
  // Line totals for the selected variant × quantity (display only until cart).
  const lineCurrentPrice = displayVariant.currentPrice * quantity;
  const lineOriginalPrice = displayVariant.originalPrice * quantity;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
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

          <div className="space-y-1 pt-2">
            <PriceTag
              currentPrice={lineCurrentPrice}
              originalPrice={lineOriginalPrice}
              size="lg"
            />
            {quantity > 1 ? (
              <p className="text-xs text-muted-foreground">
                سعر القطعة {formatPrice(displayVariant.currentPrice)} ×{" "}
                {quantity}
              </p>
            ) : null}
          </div>
        </div>

        <VariantSelector
          variants={product.variants}
          selectedId={selectedVariantId}
          onSelect={setSelectedVariantId}
        />

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <QuantitySelector
            id="product-quantity"
            value={quantity}
            onChange={setQuantity}
          />
          {/* Cart store + Sonner toast wiring: Phase 4.3 */}
          <Button
            type="button"
            size="lg"
            className="w-full cursor-pointer sm:w-auto sm:min-w-48"
            onClick={() => {
              // Intentionally empty until useCartStore exists (Phase 4).
            }}
          >
            <ShoppingCartIcon data-icon="inline-start" />
            أضف للعربة
          </Button>
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
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-20 rounded-4xl" />
            <Skeleton className="h-10 w-20 rounded-4xl" />
            <Skeleton className="h-10 w-20 rounded-4xl" />
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <Skeleton className="h-11 w-40 rounded-4xl" />
          <Skeleton className="h-10 w-full rounded-4xl sm:w-48" />
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
