import { createClient } from "@/lib/supabase/server";

export type MyProfile = {
  fullName: string | null;
  phone: string | null;
  governorate: string | null;
  markaz: string | null;
  addressText: string | null;
};

/**
 * Loads the authenticated customer's profile delivery fields.
 * Returns `null` when there is no session or no profiles row.
 */
export async function getMyProfile(): Promise<MyProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

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
