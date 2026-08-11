import { notifyAdminNewOrder } from "@/features/orders/api/notifyAdminNewOrder";
import { notifyOrderSchema } from "@/features/orders/schema";

/**
 * POST /api/orders/notify
 * Body: { orderId: string }
 * Server-only secrets (CallMeBot / Resend). Best-effort — never fails the order.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = notifyOrderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "INVALID_NOTIFY_PAYLOAD" }, { status: 400 });
  }

  try {
    const result = await notifyAdminNewOrder(parsed.data.orderId);

    if (!result.ok) {
      if (result.reason === "UNAUTHENTICATED") {
        return Response.json({ error: "UNAUTHENTICATED" }, { status: 401 });
      }
      if (result.reason === "NOT_FOUND") {
        return Response.json({ error: "ORDER_NOT_FOUND" }, { status: 404 });
      }
      return Response.json({ error: result.reason }, { status: 500 });
    }

    return Response.json({
      ok: true,
      channel: result.channel,
    });
  } catch (error) {
    console.error("[notify] route unexpected error", error);
    return Response.json({ ok: true, channel: "none" });
  }
}
