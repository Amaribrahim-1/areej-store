import Link from "next/link";

import StarRating from "@/components/shared/StarRating";
import UserAvatar from "@/components/shared/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

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
            {safeComment}
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
