import { isAuthSessionMissingError } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import type { MyProfile } from "@/types/profile";

import { profileWriteSchema, type ProfileWriteInput } from "../schema";

export type UpdateMyProfileInput = ProfileWriteInput;

/**
 * Updates the authenticated customer's name/phone/address (task 4.1).
 * Re-validates with `profileWriteSchema` before the Supabase write — the
 * `profiles_update_own` RLS policy + column grant (`full_name, phone,
 * governorate, markaz, address_text`) already scope this to the caller's
 * own row and forbid touching `role`.
 *
 * Only affects future orders: `orders` snapshots the address at checkout
 * and is never touched here.
 */
export async function updateMyProfile(
  input: UpdateMyProfileInput,
): Promise<MyProfile> {
  const parsed = profileWriteSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("INVALID_PROFILE_PAYLOAD");
  }

  const payload = parsed.data;
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    if (isAuthSessionMissingError(userError)) {
      throw new Error("UNAUTHENTICATED");
    }
    throw userError;
  }

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: payload.fullName,
      phone: payload.phone,
      governorate: payload.governorate,
      markaz: payload.markaz,
      address_text: payload.addressText,
    })
    .eq("id", user.id)
    .select("full_name, phone, governorate, markaz, address_text")
    .single();

  if (error) {
    throw error;
  }

  return {
    fullName: data.full_name,
    phone: data.phone,
    governorate: data.governorate,
    markaz: data.markaz,
    addressText: data.address_text,
  };
}
