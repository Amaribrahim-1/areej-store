import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminNotFound() {
  return (
    <EmptyState
      title="الصفحة غير موجودة"
      description="الصفحة دي مش موجودة في لوحة التحكم."
      className="min-h-[50vh]"
      action={
        <Link href="/admin" className={cn(buttonVariants())}>
          العودة للوحة التحكم
        </Link>
      }
    />
  );
}
