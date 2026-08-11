import {
  formatOrderNotificationMessage,
  type OrderNotificationPayload,
} from "./formatOrderNotificationMessage";
import { getOrderNotificationPayload } from "./getOrderNotificationPayload";
import { sendOrderEmail } from "./sendOrderEmail";
import { sendOrderWhatsApp } from "./sendOrderWhatsApp";

export type NotifyAdminChannel = "whatsapp" | "email" | "none";

export type NotifyAdminNewOrderResult =
  | { ok: true; channel: NotifyAdminChannel }
  | {
      ok: false;
      reason: "UNAUTHENTICATED" | "NOT_FOUND" | "LOAD_FAILED";
    };

async function deliverNotification(
  order: OrderNotificationPayload,
): Promise<NotifyAdminChannel> {
  const text = formatOrderNotificationMessage(order);
  const shortId = order.orderId.slice(0, 8);

  try {
    await sendOrderWhatsApp(text);
    return "whatsapp";
  } catch (whatsappError) {
    console.error("[notify] WhatsApp failed; trying email fallback", whatsappError);
  }

  try {
    await sendOrderEmail({
      subject: `طلب جديد من أريج (#${shortId})`,
      text,
      idempotencyKey: `order-notify/${order.orderId}`,
    });
    return "email";
  } catch (emailError) {
    console.error("[notify] Email fallback failed", emailError);
    return "none";
  }
}

/**
 * Best-effort admin alert after a successful place-order.
 * Delivery failure returns channel "none" — never throws for WhatsApp/email.
 * Auth/load failures return ok: false so the route can map HTTP status.
 * Unexpected delivery errors are handled by the route catch-all.
 */
export async function notifyAdminNewOrder(
  orderId: string,
): Promise<NotifyAdminNewOrderResult> {
  const loaded = await getOrderNotificationPayload(orderId);
  if (!loaded.ok) {
    return { ok: false, reason: loaded.reason };
  }

  const channel = await deliverNotification(loaded.order);
  return { ok: true, channel };
}
