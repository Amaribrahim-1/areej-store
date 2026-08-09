import { createClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string | null;
};

/**
 * Reads the authenticated user from the request cookies (server-only).
 * Returns `null` when there is no valid session.
 *
 * Prefer this over trusting client-only auth state for layouts/RSC.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}
