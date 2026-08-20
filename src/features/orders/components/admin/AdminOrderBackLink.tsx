import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminOrderBackLink() {
  return (
    <Button
      size="sm"
      variant="outline"
      render={<Link href="/admin/orders" />}
    >
      <ChevronLeftIcon
        data-icon="inline-start"
        className="rtl:rotate-180"
        aria-hidden
      />
      العودة للطلبات
    </Button>
  );
}
