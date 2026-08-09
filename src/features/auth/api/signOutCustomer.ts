import { createClient } from "@/lib/supabase/client";

/**
 * Clears the current browser session (cookies + local auth state).
 */
export async function signOutCustomer(): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
