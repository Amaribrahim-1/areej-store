import Image from "next/image";
import Link from "next/link";

import PriceTag from "@/components/shared/PriceTag";
import StarRating from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PRODUCT_CATEGORY_LABELS } from "../constants";
import type { ProductListItem } from "../types";

type ProductCardProps = {
  product: ProductListItem;
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category];
  const averageRating = product.averageRating;

  return (
    <article className={cn("group flex flex-col gap-3", className)}>
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "flex flex-col gap-3 rounded-2xl outline-none",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        )}
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-50">
          <Image
            src={product.imageUrl}
            alt={`صورة ${product.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-col gap-1.5 text-start">
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
        </div>
      </Link>
    </article>
  );
}
