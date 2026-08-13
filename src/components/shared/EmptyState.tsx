import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateTitleAs = "h1" | "h2" | "p";

type EmptyStateProps = {
  title: string;
  titleAs?: EmptyStateTitleAs;
  description?: string;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
};

const TITLE_CLASS = "font-heading text-lg font-semibold text-foreground";

export default function EmptyState({
  title,
  titleAs = "h2",
  description,
  action,
  className,
  icon,
}: EmptyStateProps) {
  const TitleTag = titleAs;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-12 text-center",
        className,
      )}
      role="status"
    >
      {icon ? (
        <div className="text-brand-400 [&_svg]:size-10" aria-hidden>
          {icon}
        </div>
      ) : null}
      <div className="space-y-1.5">
        <TitleTag className={TITLE_CLASS}>{title}</TitleTag>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
