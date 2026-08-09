import { createClient } from "@/lib/supabase/client";

export type RegisterCustomerInput = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  governorate: string;
  markaz: string;
  addressDescription: string;
};

export type RegisterCustomerResult = {
  userId: string;
  email: string;
  /** true when Auth did not return a session (email confirmation required). */
  needsEmailConfirmation: boolean;
};

/**
 * Creates an auth user and relies on `private.handle_new_user` to insert
 * the matching `profiles` row from signup metadata (task 5.6).
 */
export async function registerCustomer(
  input: RegisterCustomerInput,
): Promise<RegisterCustomerResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        full_name: input.fullName.trim(),
        phone: input.phone.trim(),
        governorate: input.governorate.trim(),
        markaz: input.markaz.trim(),
        address_text: input.addressDescription.trim(),
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
    email: user.email ?? input.email.trim(),
    needsEmailConfirmation: data.session === null,
  };
}
