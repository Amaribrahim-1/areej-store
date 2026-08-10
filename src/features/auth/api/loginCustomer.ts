import { createClient } from "@/lib/supabase/client";

import { loginSchema, type LoginType } from "../schema";

export type LoginCustomerInput = LoginType;

export type LoginCustomerResult = {
  userId: string;
  email: string;
};

/**
 * Signs in with email/password and persists the session in auth cookies
 * (via the browser Supabase client + SSR proxy refresh).
 *
 * Re-validates with `loginSchema` before any Auth call.
 */
export async function loginCustomer(
  input: LoginCustomerInput,
): Promise<LoginCustomerResult> {
  const parsed = loginSchema.safeParse({
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
    throw new Error("Login succeeded but no user was returned");
  }

  return {
    userId: user.id,
    email: user.email ?? payload.email,
  };
}
