"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, ShoppingCartIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "عنّا" },
  { href: "/contact", label: "تواصل" },
] as const;

const CART_COUNT_STUB = 6;

const IS_LOGGED_IN_STUB = false;

const accountHref = IS_LOGGED_IN_STUB ? "/orders" : "/login";
const accountLabel = IS_LOGGED_IN_STUB ? "حسابي" : "تسجيل الدخول";

function NavLink({
  href,
  label,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "text-sm font-medium text-foreground/80 transition-colors hover:text-text-accent",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileNav() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-heading text-xl font-bold tracking-tight text-brand sm:text-2xl"
        >
          أريج
        </Link>

        <nav
          className="ms-4 hidden items-center gap-6 md:flex"
          aria-label="التنقل الرئيسي"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <Link
            href={accountHref}
            className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-text-accent md:inline"
          >
            {accountLabel}
          </Link>

          <Link
            href={accountHref}
            aria-label={accountLabel}
            className="inline-flex size-9 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-muted hover:text-text-accent md:hidden"
          >
            <UserIcon className="size-5" aria-hidden />
          </Link>

          <Link
            href="/cart"
            aria-label={
              CART_COUNT_STUB > 0 ? `السلة، ${CART_COUNT_STUB} عناصر` : "السلة"
            }
            className="relative inline-flex size-9 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-muted hover:text-text-accent"
          >
            <ShoppingCartIcon className="size-5" aria-hidden />
            {CART_COUNT_STUB > 0 ? (
              <span className="absolute -top-0.5 -start-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {CART_COUNT_STUB > 99 ? "99+" : CART_COUNT_STUB}
              </span>
            ) : null}
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="فتح القائمة"
                />
              }
            >
              <MenuIcon className="size-5" aria-hidden />
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[min(100%,20rem)] bg-background"
            >
              <SheetHeader className="border-b border-border text-start">
                <SheetTitle className="font-heading text-lg text-brand">
                  أريج
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
                    onNavigate={closeMobileNav}
                    className="rounded-2xl px-3 py-3 text-base hover:bg-muted"
                  />
                ))}
              </nav>

              <div className="mt-auto border-t border-border p-4">
                <Link
                  href={accountHref}
                  onClick={closeMobileNav}
                  className="flex items-center gap-2 rounded-2xl px-3 py-3 text-base font-medium text-text-accent transition-colors hover:bg-muted"
                >
                  <UserIcon className="size-5" aria-hidden />
                  {accountLabel}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
