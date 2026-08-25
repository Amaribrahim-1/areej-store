"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { isNavActive } from "./nav-links";

type NavbarAccountActionsProps = {
  isLoggedIn: boolean;
  accountHref: string;
  accountLabel: string;
  isSigningOut: boolean;
  onSignOut: () => void;
};

export default function NavbarAccountActions({
  isLoggedIn,
  accountHref,
  accountLabel,
  isSigningOut,
  onSignOut,
}: NavbarAccountActionsProps) {
  const pathname = usePathname();
  const isAccountActive =
    isNavActive(pathname, "/account") ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      <Link
        href={accountHref}
        aria-current={isAccountActive ? "page" : undefined}
        className={cn(
          "relative hidden items-center rounded-4xl px-2.5 py-1.5 -mx-2.5 text-sm font-medium transition-[color,background-color] duration-200 md:inline-flex",
          "after:absolute after:inset-x-2.5 after:bottom-1 after:h-0.5 after:origin-center after:rounded-full after:bg-brand after:transition-transform after:duration-200",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          isAccountActive
            ? "text-text-accent after:scale-x-100"
            : "text-foreground/80 after:scale-x-0 hover:bg-bg-accent hover:text-text-accent",
        )}
      >
        {accountLabel}
      </Link>

      {isLoggedIn ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "hidden md:inline-flex",
            "text-foreground/80 hover:bg-bg-accent hover:text-text-accent",
          )}
          disabled={isSigningOut}
          onClick={onSignOut}
        >
          {isSigningOut ? "جاري الخروج..." : "خروج"}
        </Button>
      ) : null}

      <Link
        href={accountHref}
        aria-label={accountLabel}
        aria-current={isAccountActive ? "page" : undefined}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-4xl transition-colors md:hidden",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          isAccountActive
            ? "bg-bg-accent text-text-accent"
            : "text-foreground hover:bg-bg-accent hover:text-text-accent",
        )}
      >
        <UserIcon className="size-5" aria-hidden />
      </Link>
    </>
  );
}
