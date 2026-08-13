import Image from "next/image";
import { PackageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type OrderProductImageProps = {
  imageUrl: string | null;
  productName: string;
  className?: string;
  sizes?: string;
};

export default function OrderProductImage({
  imageUrl,
  productName,
  className,
  sizes = "96px",
}: OrderProductImageProps) {
  return (
    <div
      className={cn(
        "relative size-14 shrink-0 overflow-hidden rounded-xl bg-brand-50",
        className,
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`صورة ${productName}`}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <PackageIcon
          className="absolute inset-0 m-auto size-6 text-brand-300"
          aria-hidden
        />
      )}
    </div>
  );
}
