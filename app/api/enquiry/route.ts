import { NextResponse } from "next/server";
import { validate, emptyEnquiry, type EnquiryValues } from "@/lib/validation";
import { isMailConfigured, mailConfig, sendWithRetry } from "@/lib/mail";
import { autoresponderEmail, internalEmail } from "@/lib/enquiry-emails";

/**
 * Enquiry endpoint.
 *
 * Delivery is configured by environment variables — see README → Enquiry email.
 * When RESEND_API_KEY is absent the route logs the enquiry instead of sending,
 * so local dev and preview deploys work without credentials. In production that
 * fallback is a misconfiguration, so it also logs an explicit warning.
 *
 * This route is why the project does NOT set `output: "export"` in
 * next.config.ts — static export removes route handlers entirely.
 */

// In-memory rate limit. Adequate for a single Vercel region at this volume; if
// the site ever scales out, move it to Upstash or Vercel KV.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  if (HITS.size > 5000) HITS.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many enquiries from this address. Call us instead.",
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 }
    );
  }

  const partial = body as Partial<EnquiryValues>;
  const values: EnquiryValues = {
    ...emptyEnquiry,
    ...partial,
    verticals: Array.isArray(partial?.verticals)
      ? partial.verticals.slice(0, 8).map(String)
      : [],
  };

  // Honeypot: a filled `website` field means a bot. Answer 200 so it learns
  // nothing, and drop the submission.
  if (values.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Unconfigured: log and acknowledge. Never pretend to have sent in prod
  // without saying so in the logs.
  if (!isMailConfigured()) {
    const line = {
      at: new Date().toISOString(),
      company: values.companyName,
      contact: values.contactName,
      email: values.email,
      phone: values.phone,
      verticals: values.verticals,
      pin: values.pin,
      requiredBy: values.requiredBy,
      spec: values.spec,
      quantity: values.quantity,
    };
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[enquiry] RESEND_API_KEY is not set — this enquiry was NOT delivered.",
        line
      );
    } else {
      console.info("[enquiry] mail not configured, logging only", line);
    }
    return NextResponse.json({ ok: true, delivered: false });
  }

  // The internal email is the one that matters. If it fails, the buyer must not
  // see a success state — they get the error and the phone numbers instead.
  try {
    await sendWithRetry(internalEmail(values));
  } catch (e) {
    console.error("[enquiry] internal send failed", e);
    return NextResponse.json(
      {
        ok: false,
        error: "The enquiry did not send.",
      },
      { status: 502 }
    );
  }

  // The autoresponder is a courtesy. The desk already has the enquiry, so a
  // failure here is logged and swallowed — it must never turn a received
  // enquiry into an error the buyer sees.
  if (mailConfig.autoresponder) {
    try {
      await sendWithRetry(autoresponderEmail(values));
    } catch (e) {
      console.warn("[enquiry] autoresponder failed (enquiry was received)", e);
    }
  }

  return NextResponse.json({ ok: true, delivered: true });
}
