/**
 * Sends a WhatsApp text via CallMeBot (personal-use free API).
 * Docs: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 * Endpoint: GET https://api.callmebot.com/whatsapp.php?phone=&text=&apikey=
 */
export async function sendOrderWhatsApp(text: string): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE?.trim();
  const apikey = process.env.CALLMEBOT_APIKEY?.trim();

  if (!phone || !apikey) {
    throw new Error("CALLMEBOT_ENV_MISSING");
  }

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apikey);

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `CALLMEBOT_HTTP_${response.status}${body ? `: ${body.slice(0, 200)}` : ""}`,
    );
  }
}
