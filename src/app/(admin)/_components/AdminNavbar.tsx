"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import BrandLogo from "@/components/shared/BrandLogo";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/api/useSignOut";

import AdminMobileMenu from "./AdminMobileMenu";
import AdminNavLink from "./AdminNavLink";
import { ADMIN_NAV_LINKS } from "./admin-nav-links";

export default function AdminNavbar() {
  const router = useRouter();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  function closeMobileNav() {
    setMobileOpen(false);
  }

  function requestSignOut() {
    closeMobileNav();
    setSignOutOpen(true);
  }

  function confirmSignOut() {
    signOut(undefined, {
      onSuccess: () => {
        setSignOutOpen(false);
        router.push("/admin/login");
        router.refresh();
      },
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <BrandLogo
          href="/admin"
          aria-label="أريج — لوحة التحكم"
          priority
          className="size-8 sm:size-9"
        />

        <nav
          className="ms-4 hidden items-center gap-6 md:flex"
          aria-label="تنقل لوحة التحكم"
        >
          {ADMIN_NAV_LINKS.map((link) => (
            <AdminNavLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            disabled={isSigningOut}
            onClick={requestSignOut}
          >
            {isSigningOut ? "جاري الخروج..." : "تسجيل الخروج"}
          </Button>

          <AdminMobileMenu
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            isSigningOut={isSigningOut}
            onSignOut={requestSignOut}
            onNavigate={closeMobileNav}
          />
        </div>
      </div>

      <ConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title="تسجيل الخروج؟"
        description="هتخرج من لوحة التحكم على الجهاز ده."
        confirmLabel="تسجيل الخروج"
        pendingLabel="جاري الخروج..."
        isPending={isSigningOut}
        onConfirm={confirmSignOut}
      />
    </header>
  );
}
