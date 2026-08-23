"use client";
import { useAllReviews } from "@/features/reviews/api/useAllReviews";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "التقييمات",
// };

export default function AdminReviewsPage() {
  const { data } = useAllReviews();
  console.log(data);
  return (
    <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
      التقييمات
    </h1>
  );
}
