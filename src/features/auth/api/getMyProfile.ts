import { createClient } from "@/lib/supabase/server";
import type { MyProfile } from "@/types/profile";

import { getCurrentUser } from "./getCurrentUser";

export type { MyProfile };

/**
 * Loads the authenticated customer's profile delivery fields.
 * Returns `null` when there is no session or no profiles row.
 * Session-check failures throw via `getCurrentUser` (shared with the
 * protected layout) so `/account` and `/checkout` do not render an empty
 * form as if the profile were missing.
 */
export async function getMyProfile(): Promise<MyProfile | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, phone, governorate, markaz, address_text")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    fullName: data.full_name,
    phone: data.phone,
    governorate: data.governorate,
    markaz: data.markaz,
    addressText: data.address_text,
  };
}
