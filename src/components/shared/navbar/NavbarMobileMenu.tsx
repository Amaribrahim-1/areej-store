"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, MenuIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BrandLogo from "@/components/shared/BrandLogo";
import LinkPendingBar from "@/components/shared/LinkPendingBar";
import { cn } from "@/lib/utils";

import NavLink from "./NavLink";
import { isNavActive, NAV_LINKS } from "./nav-links";

type NavbarMobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountHref: string;
  accountLabel: string;
  isLoggedIn: boolean;
  isSigningOut: boolean;
  onSignOut: () => void;
  onNavigate: () => void;
};

export default function NavbarMobileMenu({
  open,
  onOpenChange,
  accountHref,
  accountLabel,
  isLoggedIn,
  isSigningOut,
  onSignOut,
  onNavigate,
}: NavbarMobileMenuProps) {
  const pathname = usePathname();
  const isAccountActive =
    isNavActive(pathname, "/account") ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            aria-label="فتح القائمة"
          />
        }
      >
        <MenuIcon className="size-5" aria-hidden />
      </SheetTrigger>

      <SheetContent side="left" className="w-[min(100%,20rem)] bg-background">
        <SheetHeader className="border-b border-border text-start">
          <SheetTitle className="flex items-center">
            <BrandLogo className="size-12" onClick={onNavigate} />
          </SheetTitle>
        </SheetHeader>

        <nav
          className="flex flex-col gap-1 px-4 py-4"
          aria-label="تنقل الموبايل"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onNavigate={onNavigate}
              variant="sheet"
            />
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-border p-4">
          <Link
            href={accountHref}
            onClick={onNavigate}
            aria-current={isAccountActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-3 py-3 text-base font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              isAccountActive
                ? "bg-bg-accent text-text-accent"
                : "text-foreground/80 hover:bg-bg-accent hover:text-text-accent",
            )}
          >
            <UserIcon className="size-5" aria-hidden />
            {accountLabel}
            <LinkPendingBar />
          </Link>

          {isLoggedIn ? (
            <button
              type="button"
              disabled={isSigningOut}
              onClick={onSignOut}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-start text-base font-medium text-foreground/80 transition-colors hover:bg-bg-accent hover:text-text-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
            >
              <LogOutIcon className="size-5" aria-hidden />
              {isSigningOut ? "جاري الخروج..." : "تسجيل الخروج"}
            </button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
