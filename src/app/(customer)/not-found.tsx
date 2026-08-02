import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CustomerNotFound() {
  return (
    <EmptyState
      title="الصفحة غير موجودة"
      description="الرابط اللي دخلت عليه مش موجود، أو المنتج اتشال من المتجر."
      className="min-h-[50vh]"
      action={
        <Link href="/" className={cn(buttonVariants())}>
          العودة للرئيسية
        </Link>
      }
    />
  );
}
