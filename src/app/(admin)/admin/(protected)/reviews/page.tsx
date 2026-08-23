import type { Metadata } from "next";

import AdminReviewsPage from "@/features/reviews/components/admin/AdminReviewsPage";

export const metadata: Metadata = {
  title: "التقييمات",
};

export default function Page() {
  return <AdminReviewsPage />;
}
