import { createClient } from "@/lib/supabase/client";

import {
  registerWriteSchema,
  type RegisterWriteInput,
} from "../schema";

export type RegisterCustomerInput = RegisterWriteInput;

export type RegisterCustomerResult = {
  userId: string;
  email: string;
  /** true when Auth did not return a session (email confirmation required). */
  needsEmailConfirmation: boolean;
};

/**
 * Creates an auth user and relies on `private.handle_new_user` to insert
 * the matching `profiles` row from signup metadata (task 5.6).
 *
 * Re-validates with `registerWriteSchema` before any Supabase write (task 5.8).
 */
export async function registerCustomer(
  input: RegisterCustomerInput,
): Promise<RegisterCustomerResult> {
  const parsed = registerWriteSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("INVALID_REGISTER_PAYLOAD");
  }

  const payload = parsed.data;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        phone: payload.phone,
        governorate: payload.governorate,
        markaz: payload.markaz,
        address_text: payload.addressDescription,
      },
    },
  });

  if (error) {
    throw error;
  }

  const user = data.user;
  if (!user) {
    throw new Error("Signup succeeded but no user was returned");
  }

  // Supabase can return a user with empty identities when the email is
  // already registered and "Confirm email" is on (anti-enumeration).
  if (!user.identities || user.identities.length === 0) {
    throw new Error("EMAIL_ALREADY_REGISTERED");
  }

  return {
    userId: user.id,
    email: user.email ?? payload.email,
    needsEmailConfirmation: data.session === null,
  };
}
