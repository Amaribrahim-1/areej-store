import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminProductsBackLink() {
  return (
    <Button
      size="sm"
      variant="outline"
      nativeButton={false}
      render={<Link href="/admin/products" />}
    >
      <ChevronLeftIcon
        data-icon="inline-start"
        className="rtl:rotate-180"
        aria-hidden
      />
      العودة للمنتجات
    </Button>
  );
}
