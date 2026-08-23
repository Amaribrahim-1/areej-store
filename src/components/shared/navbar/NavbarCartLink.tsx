import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

type NavbarCartLinkProps = {
  badgeCount: number;
};

export default function NavbarCartLink({ badgeCount }: NavbarCartLinkProps) {
  return (
    <Link
      href="/cart"
      aria-label={badgeCount > 0 ? `السلة، ${badgeCount} عناصر` : "السلة"}
      className="relative inline-flex size-11 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-muted hover:text-text-accent"
    >
      <ShoppingCartIcon className="size-5" aria-hidden />
      {badgeCount > 0 ? (
        <span className="absolute -top-0.5 -start-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      ) : null}
    </Link>
  );
}
