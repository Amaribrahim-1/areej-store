import type { AdminContactMessage } from "../../types";
import { formatContactMessageDate } from "../../lib/formatContactMessageDate";

type AdminContactMessageCardProps = {
  message: AdminContactMessage;
};

export default function AdminContactMessageCard({
  message,
}: AdminContactMessageCardProps) {
  const headingId = `admin-contact-${message.id}-heading`;

  return (
    <article
      className="rounded-2xl border border-border bg-card p-4"
      aria-labelledby={headingId}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <h2
          id={headingId}
          className="font-heading text-sm font-semibold text-foreground"
        >
          {message.name}
        </h2>
        <time
          dateTime={message.createdAt}
          className="text-xs text-muted-foreground"
        >
          {formatContactMessageDate(message.createdAt)}
        </time>
      </header>

      <p className="mt-1">
        <a
          href={`tel:${message.phone}`}
          className="rounded-sm text-sm outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
          dir="ltr"
        >
          {message.phone}
        </a>
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
        {message.message}
      </p>
    </article>
  );
}
