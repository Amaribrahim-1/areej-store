import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminAddProductLink() {
  return (
    <Button render={<Link href="/admin/products/new" />}>
      <PlusIcon data-icon="inline-start" aria-hidden />
      إضافة منتج
    </Button>
  );
}
