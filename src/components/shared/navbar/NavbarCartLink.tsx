"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { isNavActive } from "./nav-links";

type NavbarCartLinkProps = {
  badgeCount: number;
};

export default function NavbarCartLink({ badgeCount }: NavbarCartLinkProps) {
  const pathname = usePathname();
  const isActive = isNavActive(pathname, "/cart");

  return (
    <Link
      href="/cart"
      aria-label={badgeCount > 0 ? `السلة، ${badgeCount} عناصر` : "السلة"}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-4xl transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        isActive
          ? "bg-bg-accent text-text-accent"
          : "text-foreground hover:bg-bg-accent hover:text-text-accent",
      )}
    >
      <ShoppingCartIcon className="size-5" aria-hidden />
      {badgeCount > 0 ? (
        <span className="absolute -top-0.5 -start-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      ) : null}
    </Link>
  );
}
