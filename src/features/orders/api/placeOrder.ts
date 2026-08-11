import { createClient } from "@/lib/supabase/client";

import { checkoutSchema, type CheckoutInput } from "../schema";

export type PlaceOrderInput = CheckoutInput;

export type PlaceOrderResult = {
  orderId: string;
};

/**
 * Places an order via the `place_order` RPC after re-validating the payload.
 * Totals and line prices are never taken from the client — the RPC resolves them.
 */
export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("INVALID_CHECKOUT_PAYLOAD");
  }

  const payload = parsed.data;
  const supabase = createClient();

  const { data, error } = await supabase.rpc("place_order", {
    customer_name: payload.fullName,
    customer_phone: payload.phone,
    governorate: payload.governorate,
    markaz: payload.markaz,
    address_text: payload.addressText,
    items: payload.items.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
    })),
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("PLACE_ORDER_NO_ID");
  }

  return { orderId: data };
}
