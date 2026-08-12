import Image from "next/image";

import { cn } from "@/lib/utils";

const DEFAULT_AVATAR_SRC = "/avatars/default.svg";

type UserAvatarProps = {
  alt?: string;
  size?: "sm" | "md";
  className?: string;
};

const SIZE_PX = {
  sm: 40,
  md: 48,
} as const;

/**
 * Default storefront avatar — static brand asset until profiles support photos.
 */
export default function UserAvatar({
  alt = "صورة المستخدم",
  size = "sm",
  className,
}: UserAvatarProps) {
  const px = SIZE_PX[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-brand-100 ring-1 ring-brand-200",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={DEFAULT_AVATAR_SRC}
        alt={alt}
        width={px}
        height={px}
        unoptimized
        className="size-full object-cover"
      />
    </span>
  );
}
