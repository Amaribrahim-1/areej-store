import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <EmptyState
      titleAs="h1"
      title="الصفحة غير موجودة"
      description="الصفحة دي مش موجودة في لوحة التحكم."
      className="min-h-[50vh]"
      action={
        <Button render={<Link href="/admin" />}>العودة للوحة التحكم</Button>
      }
    />
  );
}
