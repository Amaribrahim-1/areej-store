import Link from "next/link";

import { cn } from "@/lib/utils";

const ACCOUNT_SECTION_LINKS = [
  { id: "account", href: "/account", label: "حسابي" },
  { id: "orders", href: "/orders", label: "طلباتي" },
] as const;

type AccountSectionId = (typeof ACCOUNT_SECTION_LINKS)[number]["id"];

type AccountSectionNavProps = {
  current: AccountSectionId;
};

export default function AccountSectionNav({
  current,
}: AccountSectionNavProps) {
  return (
    <nav aria-label="أقسام الحساب">
      <ul className="inline-flex rounded-4xl bg-muted p-[3px]">
        {ACCOUNT_SECTION_LINKS.map((link) => {
          const isCurrent = link.id === current;

          return (
            <li key={link.id}>
              <Link
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "inline-flex min-w-24 items-center justify-center rounded-xl px-4 py-1.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  isCurrent
                    ? "bg-background text-foreground"
                    : "text-foreground/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
