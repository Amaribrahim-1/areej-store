import Link from "next/link";
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

import NavLink from "./NavLink";
import { NAV_LINKS } from "./nav-links";

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
              className="rounded-2xl px-3 py-3 text-base hover:bg-muted"
            />
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-border p-4">
          <Link
            href={accountHref}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-2xl px-3 py-3 text-base font-medium text-text-accent transition-colors hover:bg-muted"
          >
            <UserIcon className="size-5" aria-hidden />
            {accountLabel}
          </Link>

          {isLoggedIn ? (
            <button
              type="button"
              disabled={isSigningOut}
              onClick={onSignOut}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-start text-base font-medium text-foreground/80 transition-colors hover:bg-muted disabled:opacity-50"
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
