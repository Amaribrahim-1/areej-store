import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  onClick?: () => void;
};

export default function BrandLogo({
  className,
  priority = false,
  onClick,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="أريج — الصفحة الرئيسية"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <Image
        src="/areej-logo.png"
        alt=""
        width={620}
        height={620}
        priority={priority}
        className="size-full object-cover"
      />
    </Link>
  );
}
