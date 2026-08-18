"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { isAdminNavActive } from "./admin-nav-links";

type AdminNavLinkProps = {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
};

export default function AdminNavLink({
  href,
  label,
  className,
  onNavigate,
}: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive = isAdminNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive
          ? "text-text-accent"
          : "text-foreground/80 hover:text-text-accent",
        className,
      )}
    >
      {label}
    </Link>
  );
}
