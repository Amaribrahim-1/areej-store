import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import PriceTag, { formatPrice } from "@/components/shared/PriceTag";
import { cn } from "@/lib/utils";

import { PAYMENT_METHOD_LABELS } from "../constants";
import type { MyOrder, MyOrderLineItem } from "../types";

import OrderProductImage from "./OrderProductImage";

type MyOrderCardProps = {
  order: MyOrder;
  className?: string;
};

const compactDateFormatter = new Intl.DateTimeFormat("ar-EG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatOrderRef(orderId: string): string {
  return orderId.replaceAll("-", "").slice(0, 8).toUpperCase();
}

function totalPieceCount(items: MyOrderLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function formatPieceCount(count: number): string {
  if (count === 1) return "قطعة واحدة";
  if (count === 2) return "قطعتان";
  if (count >= 3 && count <= 10) return `${count} قطع`;
  return `${count} قطعة`;
}

function formatItemsPreview(items: MyOrderLineItem[]): string {
  const firstName = items[0]?.productName ?? "منتجات";
  const extra = items.length - 1;

  if (extra <= 0) return firstName;
  if (extra === 1) return `${firstName} ومنتج آخر`;
  if (extra === 2) return `${firstName} ومنتجان آخران`;
  if (extra <= 10) return `${firstName} و${extra} منتجات أخرى`;
  return `${firstName} و${extra} منتجًا آخر`;
}

function previewThumbs(items: MyOrderLineItem[]): MyOrderLineItem[] {
  const seen = new Set<string>();
  const thumbs: MyOrderLineItem[] = [];

  for (const item of items) {
    if (seen.has(item.productId)) continue;
    seen.add(item.productId);
    thumbs.push(item);
    if (thumbs.length === 3) break;
  }

  return thumbs;
}

export default function MyOrderCard({ order, className }: MyOrderCardProps) {
  const orderRef = formatOrderRef(order.id);
  const pieceCountLabel = formatPieceCount(totalPieceCount(order.items));
  const itemsPreview = formatItemsPreview(order.items);
  const thumbs = previewThumbs(order.items);
  const placedAtLabel = compactDateFormatter.format(new Date(order.createdAt));

  return (
    <article
      className={cn("rounded-2xl border border-border bg-card", className)}
      aria-labelledby={`order-${order.id}-heading`}
    >
      <details className="group">
        <summary
          className={cn(
            "cursor-pointer list-none p-4 sm:p-5",
            "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "[&::-webkit-details-marker]:hidden",
          )}
        >
          {/* Mobile: stacked. Desktop: one horizontal row. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:items-center">
              <OrderPreviewThumbs items={thumbs} />

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id={`order-${order.id}-heading`}
                    className="font-heading text-base font-semibold text-foreground"
                  >
                    طلب رقم {orderRef}
                  </h2>
                  <OrderStatusBadge status={order.status} />
                </div>

                <p className="truncate text-sm text-foreground">{itemsPreview}</p>

                <p className="whitespace-nowrap text-xs text-muted-foreground">
                  <time dateTime={order.createdAt}>{placedAtLabel}</time>
                  <span aria-hidden> · </span>
                  {pieceCountLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:shrink-0 sm:border-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2">
              <PriceTag currentPrice={order.total} size="md" />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <span className="group-open:hidden">التفاصيل</span>
                <span className="hidden group-open:inline">إخفاء</span>
                <ChevronDownIcon
                  className="size-4 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </summary>

        <div className="border-t border-border px-4 pb-4 sm:px-5 sm:pb-5">
          <p className="pt-3 text-sm text-muted-foreground">
            <time dateTime={order.createdAt}>
              {fullDateFormatter.format(new Date(order.createdAt))}
            </time>
          </p>

          <ul className="mt-1 divide-y divide-border">
            {order.items.map((item) => (
              <MyOrderCardItem key={item.id} item={item} />
            ))}
          </ul>

          <footer className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">الإجمالي</span>
              <PriceTag currentPrice={order.total} size="lg" />
            </div>
          </footer>
        </div>
      </details>
    </article>
  );
}

type OrderPreviewThumbsProps = {
  items: MyOrderLineItem[];
};

function OrderPreviewThumbs({ items }: OrderPreviewThumbsProps) {
  const stackZ = ["z-30", "z-20", "z-10"] as const;

  return (
    <div className="flex shrink-0" aria-hidden>
      {items.map((item, index) => (
        <OrderProductImage
          key={item.productId}
          imageUrl={item.imageUrl}
          productName={item.productName}
          sizes="56px"
          className={cn(
            "size-12 rounded-xl border-2 border-card sm:size-14",
            stackZ[index],
            index > 0 && "-ms-3",
          )}
        />
      ))}
    </div>
  );
}

type MyOrderCardItemProps = {
  item: MyOrderLineItem;
};

function MyOrderCardItem({ item }: MyOrderCardItemProps) {
  const image = (
    <OrderProductImage
      imageUrl={item.imageUrl}
      productName={item.productName}
      className="size-14 rounded-2xl sm:size-16"
      sizes="64px"
    />
  );

  return (
    <li className="flex items-start gap-3 py-3">
      {item.slug ? (
        <Link
          href={`/products/${item.slug}`}
          className="shrink-0 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {image}
        </Link>
      ) : (
        image
      )}

      <div className="min-w-0 flex-1 space-y-0.5">
        {item.slug ? (
          <Link
            href={`/products/${item.slug}`}
            className="font-heading font-semibold text-foreground outline-none hover:text-text-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {item.productName}
          </Link>
        ) : (
          <p className="font-heading font-semibold text-foreground">
            {item.productName}
          </p>
        )}
        {item.variantLabel ? (
          <p className="text-sm text-muted-foreground">{item.variantLabel}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          الكمية {item.quantity} × {formatPrice(item.unitPrice)}
        </p>
      </div>

      <PriceTag currentPrice={item.lineTotal} size="sm" className="shrink-0" />
    </li>
  );
}
