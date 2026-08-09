import { createClient } from "@/lib/supabase/client";

export type LoginCustomerInput = {
  email: string;
  password: string;
};

export type LoginCustomerResult = {
  userId: string;
  email: string;
};

/**
 * Signs in with email/password and persists the session in auth cookies
 * (via the browser Supabase client + SSR proxy refresh).
 */
export async function loginCustomer(
  input: LoginCustomerInput,
): Promise<LoginCustomerResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
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
    email: user.email ?? input.email.trim(),
  };
}
