import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckoutSuccess() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center"
      role="status"
    >
      <div className="text-brand-400 [&_svg]:size-10" aria-hidden>
        <CheckCircle2Icon />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          تم استلام طلبك
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          هنتواصل معاكي قريبًا لتأكيد التوصيل. تقدري تتابعي الطلب من صفحة
          طلباتي.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <Link href="/orders" className={cn(buttonVariants())}>
          عرض طلباتي
        </Link>
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          متابعة التسوق
        </Link>
      </div>
    </div>
  );
}
