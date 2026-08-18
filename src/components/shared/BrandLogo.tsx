import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  href?: string;
  "aria-label"?: string;
};

export default function BrandLogo({
  className,
  priority = false,
  onClick,
  href = "/",
  "aria-label": ariaLabel = "أريج — الصفحة الرئيسية",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <Image
        src="/areej-logo.jpg"
        alt=""
        width={1024}
        height={1024}
        priority={priority}
        className="size-full object-cover"
      />
    </Link>
  );
}
