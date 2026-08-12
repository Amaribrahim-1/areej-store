import Link from "next/link";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

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
  return (
    <>
      <Link
        href={accountHref}
        className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-text-accent md:inline"
      >
        {accountLabel}
      </Link>

      {isLoggedIn ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="hidden md:inline-flex"
          disabled={isSigningOut}
          onClick={onSignOut}
        >
          {isSigningOut ? "جاري الخروج..." : "خروج"}
        </Button>
      ) : null}

      <Link
        href={accountHref}
        aria-label={accountLabel}
        className="inline-flex size-9 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-muted hover:text-text-accent md:hidden"
      >
        <UserIcon className="size-5" aria-hidden />
      </Link>
    </>
  );
}
