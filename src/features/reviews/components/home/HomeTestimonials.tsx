"use client";

import { MessageSquareIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";

import { useHomeTestimonials } from "../../api/useHomeTestimonials";
import { HOME_TESTIMONIALS_PAGE_SIZE } from "../../constants";
import HomeTestimonialCard from "./HomeTestimonialCard";
import HomeTestimonialsSkeleton from "./HomeTestimonialsSkeleton";

const TESTIMONIALS_GRID_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4";

export default function HomeTestimonials() {
  const { data, isPending, isError, refetch } = useHomeTestimonials({
    pageSize: HOME_TESTIMONIALS_PAGE_SIZE,
  });

  return (
    <section
      aria-labelledby="home-testimonials-heading"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
        <header className="mb-6 sm:mb-8">
          <h2
            id="home-testimonials-heading"
            className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-3xl"
          >
            آراء العملاء
          </h2>
        </header>

        {isPending ? (
          <HomeTestimonialsSkeleton count={HOME_TESTIMONIALS_PAGE_SIZE} />
        ) : isError ? (
          <ErrorState
            title="فشل تحميل الآراء"
            description="تعذّر جلب آراء العملاء. حاول مرة أخرى."
            onRetry={() => refetch()}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<MessageSquareIcon />}
            title="لا توجد آراء بعد"
            titleAs="p"
            description="لما يكتب العملاء تقييمًا مع تعليق، هيظهر هنا."
          />
        ) : (
          <ul className={cn("list-none", TESTIMONIALS_GRID_CLASS)}>
            {data.map((testimonial) => (
              <li key={testimonial.id}>
                <HomeTestimonialCard testimonial={testimonial} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
