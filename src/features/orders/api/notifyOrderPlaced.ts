/**
 * Client-side fire-and-forget trigger for admin order notification.
 * Never throws — place-order UX must not depend on notify success.
 */
export async function notifyOrderPlaced(orderId: string): Promise<void> {
  try {
    await fetch("/api/orders/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ orderId }),
    });
  } catch (error) {
    console.error("[notify] client request failed", error);
  }
}
