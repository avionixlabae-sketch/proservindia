import "server-only";
import { Resend } from "resend";

/**
 * Mail transport.
 *
 * One small interface with one implementation, so swapping Resend for SES,
 * Postmark or a CRM webhook later is a change to this file and nothing else.
 * The route never imports the vendor SDK directly.
 *
 * Configured entirely by environment variables. If they are absent the
 * transport is `null` and the caller falls back to logging — the site runs
 * locally and in preview without credentials, and an unconfigured production
 * deploy fails loudly at the route rather than silently pretending to send.
 */

export interface MailMessage {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface MailTransport {
  name: string;
  send(msg: MailMessage): Promise<void>;
}

export const mailConfig = {
  /** Where enquiries land. Comma-separated for more than one recipient. */
  to: (process.env.ENQUIRY_TO ?? "Sales@proservindia.in")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  /**
   * Must be a sender on a domain verified in Resend. `onboarding@resend.dev`
   * works for testing but is rate-limited and lands in spam — verify
   * proservindia.in before launch. See README → Enquiry email.
   */
  from: process.env.ENQUIRY_FROM ?? "Proserv <enquiries@proservindia.in>",
  /** Set false to stop the buyer autoresponder without touching code. */
  autoresponder: process.env.ENQUIRY_AUTORESPONDER !== "off",
};

function createTransport(): MailTransport | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;

  const resend = new Resend(key);

  return {
    name: "resend",
    async send(msg) {
      const { error } = await resend.emails.send({
        from: mailConfig.from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        ...(msg.html ? { html: msg.html } : {}),
        ...(msg.replyTo ? { replyTo: msg.replyTo } : {}),
      });
      if (error) {
        throw new Error(`resend: ${error.name} — ${error.message}`);
      }
    },
  };
}

let cached: MailTransport | null | undefined;

export function getTransport(): MailTransport | null {
  if (cached === undefined) cached = createTransport();
  return cached;
}

export const isMailConfigured = () => getTransport() !== null;

/**
 * Send with one retry. Transient 5xx and network blips are common enough on
 * any mail API that a single retry meaningfully reduces lost enquiries, and
 * cheap enough that it does not risk the request timing out.
 */
export async function sendWithRetry(msg: MailMessage): Promise<void> {
  const transport = getTransport();
  if (!transport) throw new Error("mail transport not configured");

  try {
    await transport.send(msg);
  } catch (first) {
    await new Promise((r) => setTimeout(r, 400));
    try {
      await transport.send(msg);
    } catch (second) {
      throw new Error(
        `mail send failed twice: ${String(first)} | ${String(second)}`
      );
    }
  }
}
