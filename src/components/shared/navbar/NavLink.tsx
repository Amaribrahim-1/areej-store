"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { isNavActive } from "./nav-links";

type NavLinkProps = {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
  /** Desktop bar uses underline; mobile sheet uses pill background. */
  variant?: "bar" | "sheet";
};

export default function NavLink({
  href,
  label,
  className,
  onNavigate,
  variant = "bar",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "font-medium transition-[color,background-color,transform] duration-200",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        variant === "bar" && [
          // px for a comfortable hover pill; -mx keeps text spacing = original gap-6
          "relative inline-flex items-center rounded-4xl px-2.5 py-1.5 -mx-2.5 text-sm",
          "after:absolute after:inset-x-2.5 after:bottom-1 after:h-0.5 after:origin-center after:rounded-full after:bg-brand after:transition-transform after:duration-200",
          isActive
            ? "text-text-accent after:scale-x-100"
            : "text-foreground/80 after:scale-x-0 hover:bg-bg-accent hover:text-text-accent",
        ],
        variant === "sheet" && [
          "rounded-2xl px-3 py-3 text-base",
          isActive
            ? "bg-bg-accent text-text-accent"
            : "text-foreground/80 hover:bg-bg-accent hover:text-text-accent",
        ],
        className,
      )}
    >
      {label}
    </Link>
  );
}
