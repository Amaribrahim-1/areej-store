import { createClient } from "@/lib/supabase/client";

/**
 * Clears the current browser session (cookies + local auth state).
 * Shared by storefront and admin — both use the same Auth session.
 */
export async function signOutSession(): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
