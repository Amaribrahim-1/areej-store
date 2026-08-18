import { createClient } from "@/lib/supabase/client";

import { USER_ROLES } from "../constants";
import { adminLoginSchema } from "../schema";
import type { LoginAdminInput, LoginAdminResult } from "../types";

/**
 * Re-validates with `adminLoginSchema` before Auth. A non-admin sign-in is
 * signed out so that session cannot linger after a rejected admin login.
 */
export async function loginAdmin(
  input: LoginAdminInput,
): Promise<LoginAdminResult> {
  const parsed = adminLoginSchema.safeParse({
    email: input.email.trim(),
    password: input.password,
  });
  if (!parsed.success) {
    throw new Error("INVALID_LOGIN_PAYLOAD");
  }

  const payload = parsed.data;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw error;
  }

  const user = data.user;
  if (!user) {
    throw new Error("LOGIN_FAILED");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    throw new Error("ADMIN_PROFILE_UNAVAILABLE");
  }

  if (profile?.role !== USER_ROLES.admin) {
    await supabase.auth.signOut();
    throw new Error("NOT_ADMIN");
  }

  return {
    userId: user.id,
    email: user.email ?? payload.email,
  };
}
