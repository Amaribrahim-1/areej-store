"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { type AuthUser } from "@/features/auth/api/getCurrentUser";
import { useCurrentUser } from "@/features/auth/api/useCurrentUser";
import { useSignOut } from "@/features/auth/api/useSignOut";
import { getCartItemCount, useCartStore } from "@/features/cart/public";
import { cn } from "@/lib/utils";

import BrandLogo from "./BrandLogo";
import NavLink from "./navbar/NavLink";
import NavbarAccountActions from "./navbar/NavbarAccountActions";
import NavbarCartLink from "./navbar/NavbarCartLink";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import { NAV_LINKS } from "./navbar/nav-links";

type NavbarProps = {
  initialUser: AuthUser | null;
};

const SCROLL_SOLID_AT = 8;

export default function Navbar({ initialUser }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const user = useCurrentUser(initialUser);

  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useCartStore((state) => getCartItemCount(state.items));

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(false);
      return;
    }

    function updateScrolled() {
      setIsScrolled(window.scrollY > SCROLL_SOLID_AT);
    }

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [isHome]);

  const isOverlay = isHome && !isScrolled;

  function closeMobileNav() {
    setMobileOpen(false);
  }

  function handleSignOut() {
    signOut(undefined, {
      onSuccess: () => {
        closeMobileNav();
        router.push("/");
        router.refresh();
      },
    });
  }

  const badgeCount = hasMounted ? cartCount : 0;
  const isLoggedIn = user !== null;
  const accountHref = isLoggedIn ? "/account" : "/login";
  const accountLabel = isLoggedIn ? "حسابي" : "تسجيل الدخول";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-200",
        isOverlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <BrandLogo priority className="size-8 sm:size-9" />

        <nav
          className="ms-4 hidden items-center gap-6 md:flex"
          aria-label="التنقل الرئيسي"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <NavbarAccountActions
            isLoggedIn={isLoggedIn}
            accountHref={accountHref}
            accountLabel={accountLabel}
            isSigningOut={isSigningOut}
            onSignOut={handleSignOut}
          />

          <NavbarCartLink badgeCount={badgeCount} />

          <NavbarMobileMenu
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            accountHref={accountHref}
            accountLabel={accountLabel}
            isLoggedIn={isLoggedIn}
            isSigningOut={isSigningOut}
            onSignOut={handleSignOut}
            onNavigate={closeMobileNav}
          />
        </div>
      </div>
    </header>
  );
}
