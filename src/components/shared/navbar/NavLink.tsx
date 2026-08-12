import Link from "next/link";

import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
};

export default function NavLink({
  href,
  label,
  className,
  onNavigate,
}: NavLinkProps) {
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
