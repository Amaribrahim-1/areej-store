import { createClient } from "@/lib/supabase/client";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import type { AdminContactMessage } from "../types";

type AdminContactMessageRow = {
  id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
};

/**
 * Returns every contact message for the admin inbox, newest first.
 * Empty inbox → `[]`. Non-admin sessions fail with `NOT_ADMIN`.
 * Sanitizes name and message on the read path (stored XSS).
 */
export async function getAdminContactMessages(): Promise<AdminContactMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("list_admin_contact_messages");

  if (error) {
    throwAdminContactMessagesError(error);
  }

  return ((data ?? []) as AdminContactMessageRow[]).map(toAdminContactMessage);
}

function toAdminContactMessage(row: AdminContactMessageRow): AdminContactMessage {
  return {
    id: row.id,
    name: sanitizePlainText(row.name),
    phone: row.phone,
    message: sanitizePlainText(row.message),
    createdAt: row.created_at,
  };
}

function throwAdminContactMessagesError(error: { message: string }): never {
  if (error.message.includes("NOT_ADMIN")) {
    throw new Error("NOT_ADMIN");
  }
  throw error;
}
