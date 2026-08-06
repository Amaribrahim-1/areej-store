"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";

import PriceTag from "@/components/shared/PriceTag";
import StarRating from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import { cn } from "@/lib/utils";

import { PRODUCT_CATEGORY_LABELS } from "../constants";
import type { ProductListItem } from "../types";

type ProductCardProps = {
  product: ProductListItem;
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category];
  const averageRating = product.averageRating;
  const productHref = `/products/${product.slug}`;

  function handleAddToCart() {
    if (product.variantCount === 1) {
      addItem({
        productId: product.id,
        variantId: product.displayVariantId,
        quantity: 1,
        unitPriceSnapshot: product.currentPrice,
      });
      toast.success("تمت الإضافة إلى العربة");
      return;
    }

    toast.info("اختاري الحجم المناسب قبل الإضافة للعربة");
    router.push(productHref);
  }

  return (
    <article className={cn("group flex flex-col gap-3", className)}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-50">
        <Link
          href={productHref}
          className={cn(
            "absolute inset-0 block outline-none",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50",
          )}
          aria-label={`عرض ${product.name}`}
        >
          <Image
            src={product.imageUrl}
            alt={`صورة ${product.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Desktop: hover overlay on the image */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 hidden justify-center gap-2 bg-linear-to-t from-black/45 to-transparent p-3 pt-10 md:flex",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        >
          <CardActions
            productName={product.name}
            productHref={productHref}
            onAddToCart={handleAddToCart}
            className="pointer-events-auto"
          />
        </div>
      </div>

      {/* Mobile: stacked actions — side-by-side is too cramped in a 2-col grid */}
      <div className="flex flex-col gap-2 md:hidden">
        <CardActions
          productName={product.name}
          productHref={productHref}
          onAddToCart={handleAddToCart}
          compact
        />
      </div>

      <Link
        href={productHref}
        className={cn(
          "flex flex-col gap-1.5 rounded-2xl text-start outline-none",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        )}
      >
        <Badge
          variant="secondary"
          className="bg-brand-100 text-brand-800 hover:bg-brand-100"
        >
          {categoryLabel}
        </Badge>

        <h3 className="font-heading text-base font-medium leading-snug text-foreground transition-colors group-hover:text-text-accent">
          {product.name}
        </h3>

        {averageRating !== null ? (
          <div className="flex items-center gap-2">
            <StarRating value={averageRating} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">لا توجد تقييمات بعد</p>
        )}

        <PriceTag
          currentPrice={product.currentPrice}
          originalPrice={product.originalPrice}
          size="sm"
        />
      </Link>
    </article>
  );
}

type CardActionsProps = {
  productName: string;
  productHref: string;
  onAddToCart: () => void;
  compact?: boolean;
  className?: string;
};

function CardActions({
  productName,
  productHref,
  onAddToCart,
  compact = false,
  className,
}: CardActionsProps) {
  return (
    <>
      <Link
        href={productHref}
        className={cn(
          buttonVariants({
            size: compact ? "xs" : "sm",
            variant: "secondary",
          }),
          compact && "w-full justify-center",
          !compact &&
            "bg-background/95 text-foreground shadow-sm hover:bg-background",
          className,
        )}
      >
        <EyeIcon data-icon="inline-start" />
        معاينة
      </Link>
      <Button
        type="button"
        size={compact ? "xs" : "sm"}
        className={cn(compact && "w-full justify-center", !compact && "shadow-sm", className)}
        onClick={onAddToCart}
        aria-label={`إضافة ${productName} إلى السلة`}
      >
        <ShoppingCartIcon data-icon="inline-start" />
        أضف
      </Button>
    </>
  );
}
