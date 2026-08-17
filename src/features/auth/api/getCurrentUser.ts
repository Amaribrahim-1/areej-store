import { isAuthSessionMissingError } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string | null;
};

/**
 * Reads the authenticated user from the request cookies (server-only).
 * Returns `null` only for the confirmed "no session" case (guest). Any other
 * `getUser()` failure (network blip, server hiccup) throws instead, so
 * callers like `requireCustomer` can show an error state rather than
 * redirecting an actually-logged-in customer to `/login` — mirrors
 * `getCustomerOrders`'s error handling.
 *
 * Prefer this over trusting client-only auth state for layouts/RSC.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (isAuthSessionMissingError(error)) {
      return null;
    }
    throw error;
  }

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}
