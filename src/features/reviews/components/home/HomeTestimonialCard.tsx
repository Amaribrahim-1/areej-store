import Link from "next/link";
import { QuoteIcon } from "lucide-react";

import StarRating from "@/components/shared/StarRating";
import UserAvatar from "@/components/shared/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { sanitizePlainText } from "@/lib/sanitizePlainText";
import { cn } from "@/lib/utils";

import type { HomeTestimonial } from "../../types";

type HomeTestimonialCardProps = {
  testimonial: HomeTestimonial;
};

export default function HomeTestimonialCard({
  testimonial,
}: HomeTestimonialCardProps) {
  const safeComment = sanitizePlainText(testimonial.comment);
  const productHref = `/products/${testimonial.productSlug}`;

  return (
    <Card className="h-full py-5">
      <CardContent className="flex h-full flex-col gap-4">
        <header>
          <Link
            href={productHref}
            className="block truncate text-sm font-medium text-brand hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {testimonial.productName}
          </Link>
        </header>

        <StarRating
          value={testimonial.rating}
          size="sm"
          className="self-start"
        />

        <blockquote className="min-h-0 flex-1">
          <p className="line-clamp-5 text-sm leading-relaxed text-foreground">
            {/* <QuoteMark /> */}
            {safeComment}
            {/* <QuoteMark close /> */}
          </p>
        </blockquote>

        <footer className="mt-auto flex items-center gap-3 border-t border-border pt-4">
          <UserAvatar alt={`صورة ${testimonial.authorName}`} size="sm" />
          <p className="min-w-0 truncate font-medium text-foreground">
            {testimonial.authorName}
          </p>
        </footer>
      </CardContent>
    </Card>
  );
}

function QuoteMark({ close = false }: { close?: boolean }) {
  return (
    <QuoteIcon
      className={cn(
        "inline size-3.5 -translate-y-0.5 text-brand-400 rtl:-scale-x-100",
        close ? "ms-1 rotate-180" : "me-1",
      )}
      aria-hidden
    />
  );
}
