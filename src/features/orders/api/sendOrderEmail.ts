import { Resend } from "resend";

/**
 * Email fallback via Resend (server-only API key).
 * Docs: https://resend.com/docs/send-with-nodejs
 */
export async function sendOrderEmail(input: {
  subject: string;
  text: string;
  idempotencyKey: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ORDER_NOTIFY_EMAIL_TO?.trim();
  const from = process.env.ORDER_NOTIFY_EMAIL_FROM?.trim();

  if (!apiKey || !to || !from) {
    throw new Error("RESEND_ENV_MISSING");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from,
      to: [to],
      subject: input.subject,
      text: input.text,
    },
    { idempotencyKey: input.idempotencyKey },
  );

  if (error) {
    throw new Error(error.message || "RESEND_SEND_FAILED");
  }
}
