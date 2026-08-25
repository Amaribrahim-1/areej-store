"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * App Router keeps a shared layout mounted across navigations, so the
 * previous scroll offset can survive into the next page (checkout from a
 * scrolled cart lands on the footer). Reset before paint on every route.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
