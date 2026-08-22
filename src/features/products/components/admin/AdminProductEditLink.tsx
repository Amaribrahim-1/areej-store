import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type AdminProductEditLinkProps = {
  productId: string;
  productName: string;
};

export default function AdminProductEditLink({
  productId,
  productName,
}: AdminProductEditLinkProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      render={<Link href={`/admin/products/${productId}/edit`} />}
      aria-label={`تعديل ${productName}`}
    >
      <PencilIcon data-icon="inline-start" aria-hidden />
      تعديل
    </Button>
  );
}
