import { isAuthSessionMissingError } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

import { requireOrderStatus, type OrderStatus } from "../../constants";
import {
  updateAdminOrderStatusSchema,
  type UpdateAdminOrderStatusInput,
} from "../../schema";

export type { UpdateAdminOrderStatusInput };

export type UpdateAdminOrderStatusResult = {
  status: OrderStatus;
};

/**
 * Sets one order's status. Re-validates with
 * `updateAdminOrderStatusSchema` before the write. RLS + the `status`
 * column grant are the authorization boundary — this helper does not
 * trust the UI to be the only guard.
 */
export async function updateAdminOrderStatus(
  input: UpdateAdminOrderStatusInput,
): Promise<UpdateAdminOrderStatusResult> {
  const parsed = updateAdminOrderStatusSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("INVALID_ORDER_STATUS_PAYLOAD");
  }

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
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.orderId)
    .select("status")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("ORDER_NOT_FOUND");
  }

  return { status: requireOrderStatus(data.status) };
}
