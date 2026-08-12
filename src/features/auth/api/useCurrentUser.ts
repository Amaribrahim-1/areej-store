"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import type { AuthUser } from "./getCurrentUser";

/**
 * Client auth identity for UI gating (navbar, review form, etc.).
 * Prefer passing `initialUser` from a server layout to avoid a logged-out flash.
 * Live updates come from `onAuthStateChange` — not TanStack Query / server `getCurrentUser`.
 */
export function useCurrentUser(
  initialUser: AuthUser | null = null,
): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user;
      setUser(
        nextUser ? { id: nextUser.id, email: nextUser.email ?? null } : null,
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}
