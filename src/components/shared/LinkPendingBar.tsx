"use client";

import { useLinkStatus } from "next/link";

import { cn } from "@/lib/utils";

/**
 * Thin top bar while a `next/link` navigation is pending.
 * Must render as a descendant of that `Link`.
 */
export default function LinkPendingBar() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-brand transition-opacity duration-200",
        pending ? "opacity-100 delay-100" : "opacity-0",
      )}
    />
  );
}
