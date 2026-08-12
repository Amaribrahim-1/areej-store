"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { type AuthUser } from "@/features/auth/api/getCurrentUser";
import { useCurrentUser } from "@/features/auth/api/useCurrentUser";
import { useSignOut } from "@/features/auth/api/useSignOut";
import { getCartItemCount } from "@/features/cart/lib/getCartItemCount";
import { useCartStore } from "@/features/cart/store";

import NavLink from "./navbar/NavLink";
import NavbarAccountActions from "./navbar/NavbarAccountActions";
import NavbarCartLink from "./navbar/NavbarCartLink";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import { NAV_LINKS } from "./navbar/nav-links";

type NavbarProps = {
  initialUser: AuthUser | null;
};

export default function Navbar({ initialUser }: NavbarProps) {
  const router = useRouter();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const user = useCurrentUser(initialUser);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const cartCount = useCartStore((state) => getCartItemCount(state.items));

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
  const accountHref = isLoggedIn ? "/orders" : "/login";
  const accountLabel = isLoggedIn ? "حسابي" : "تسجيل الدخول";

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
