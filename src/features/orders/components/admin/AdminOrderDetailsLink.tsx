import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type AdminOrderDetailsLinkProps = {
  orderId: string;
  customerName: string;
};

export default function AdminOrderDetailsLink({
  orderId,
  customerName,
}: AdminOrderDetailsLinkProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      render={<Link href={`/admin/orders/${orderId}`} />}
      aria-label={`تفاصيل طلب ${customerName}`}
    >
      التفاصيل
      <ChevronRightIcon
        data-icon="inline-end"
        className="rtl:rotate-180"
        aria-hidden
      />
    </Button>
  );
}
