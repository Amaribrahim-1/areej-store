"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BrandLogo from "@/components/shared/BrandLogo";

import AdminNavLink from "./AdminNavLink";
import { ADMIN_NAV_LINKS } from "./admin-nav-links";

type AdminMobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSigningOut: boolean;
  onSignOut: () => void;
  onNavigate: () => void;
};

export default function AdminMobileMenu({
  open,
  onOpenChange,
  isSigningOut,
  onSignOut,
  onNavigate,
}: AdminMobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            aria-label="فتح قائمة لوحة التحكم"
          />
        }
      >
        <MenuIcon className="size-5" aria-hidden />
      </SheetTrigger>

      <SheetContent side="left" className="w-[min(100%,20rem)] bg-background">
        <SheetHeader className="border-b border-border text-start">
          <SheetTitle className="flex items-center">
            <BrandLogo
              href="/admin"
              aria-label="أريج — لوحة التحكم"
              className="size-12"
              onClick={onNavigate}
            />
          </SheetTitle>
        </SheetHeader>

        <nav
          className="flex flex-col gap-1 px-4 py-4"
          aria-label="تنقل لوحة التحكم"
        >
          {ADMIN_NAV_LINKS.map((link) => (
            <AdminNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onNavigate={onNavigate}
              className="rounded-2xl px-3 py-3 text-base hover:bg-muted"
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-border p-4">
          <button
            type="button"
            disabled={isSigningOut}
            onClick={onSignOut}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-start text-base font-medium text-foreground/80 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <LogOutIcon className="size-5" aria-hidden />
            {isSigningOut ? "جاري الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
