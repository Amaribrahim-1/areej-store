import type { Metadata } from "next";
import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

export default function CustomerNotFound() {
  return (
    <EmptyState
      titleAs="h1"
      title="الصفحة غير موجودة"
      description="الرابط اللي دخلتي عليه مش موجود، أو المنتج اتشال من المتجر."
      className="min-h-[50vh]"
      action={<Button render={<Link href="/" />}>العودة للرئيسية</Button>}
    />
  );
}
