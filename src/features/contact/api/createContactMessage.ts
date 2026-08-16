import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { contactSchema } from "../schema";
import type {
  CreateContactMessageInput,
  CreateContactMessageResult,
} from "../types";

function mapSubmitError(error: { message?: string }): Error {
  const raw = error.message ?? "";
  if (raw.includes("CONTACT_RATE_LIMITED")) {
    return new Error("CONTACT_RATE_LIMITED");
  }
  if (raw.includes("INVALID_CONTACT_PAYLOAD")) {
    return new Error("INVALID_CONTACT_PAYLOAD");
  }
  return new Error(raw || "CONTACT_SUBMIT_FAILED");
}

/**
 * Submits a contact message via `submit_contact_message`.
 * Re-validates with `contactSchema` and sanitizes free-text before the RPC.
 * Rate limit and a second sanitize pass live in the RPC (task 10.3).
 */
export async function createContactMessage(
  input: CreateContactMessageInput,
): Promise<CreateContactMessageResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("INVALID_CONTACT_PAYLOAD");
  }

  const sanitized = contactSchema.safeParse({
    name: sanitizePlainText(parsed.data.name),
    phone: parsed.data.phone,
    message: sanitizePlainText(parsed.data.message),
  });
  if (!sanitized.success) {
    throw new Error("INVALID_CONTACT_PAYLOAD");
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc("submit_contact_message", {
    p_name: sanitized.data.name,
    p_phone: sanitized.data.phone,
    p_message: sanitized.data.message,
  });

  if (error) {
    throw mapSubmitError(error);
  }

  if (!data) {
    throw new Error("CONTACT_SUBMIT_FAILED");
  }

  return { id: data };
}
