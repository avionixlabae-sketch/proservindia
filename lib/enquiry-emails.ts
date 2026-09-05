import type { EnquiryValues } from "./validation";
import type { MailMessage } from "./mail";
import { mailConfig } from "./mail";
import { contact, company } from "@/content/company";
import { verticalBySlug } from "@/content/verticals";

/**
 * The two emails an enquiry produces.
 *
 * Both are written in the profile's register — plain, specific, short
 * declarative sentences, no superlatives. The autoresponder is the first thing
 * a buyer reads from Proserv, so it repeats the 24-hour commitment in the same
 * words the site uses and gives the phone numbers as the faster path, matching
 * the on-page success state exactly.
 *
 * Plain text is the primary body; the HTML is a minimal, unstyled mirror.
 * Procurement inboxes are frequently plain-text or aggressively sanitised, and
 * a heavily designed email is more likely to be filtered than a plain one.
 */

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");

function verticalNames(slugs: string[]) {
  return slugs.map((s) => verticalBySlug(s)?.name ?? s).join(", ");
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

/* ── Internal: the enquiry itself ─────────────────────────────────────────── */

/**
 * Subject leads with company and verticals so the desk can triage from the
 * inbox list without opening anything. Reply-To is the buyer, so hitting reply
 * answers them directly rather than the no-reply sender.
 */
export function internalEmail(v: EnquiryValues): MailMessage {
  const rows: [string, string][] = [
    ["Company", v.companyName],
    ["Contact", v.contactName],
    ["Email", v.email],
    ["Phone", v.phone],
    ["Verticals", verticalNames(v.verticals)],
    ["Delivery location", v.location],
    ["PIN code", v.pin],
    ["Required by", formatDate(v.requiredBy)],
    ["GSTIN", v.gstin || "not supplied"],
    ["Billing entity", v.billingEntity || "same as company"],
  ];

  const text = [
    `New enquiry — ${v.companyName}`,
    "",
    `Quotation due within 24 hours (received ${new Date().toLocaleString(
      "en-IN",
      { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }
    )} IST).`,
    "",
    "WHAT THEY NEED QUOTED",
    v.spec,
    "",
    "QUANTITY AND PHASING",
    v.quantity,
    "",
    "DETAILS",
    ...rows.map(([k, val]) => `${k.padEnd(20)} ${val}`),
    "",
    `Reply to this email to answer ${v.contactName} directly.`,
  ].join("\n");

  const html = `
<p><strong>New enquiry — ${esc(v.companyName)}</strong></p>
<p>Quotation due within 24 hours.</p>
<h3 style="margin:20px 0 4px">What they need quoted</h3>
<p>${nl2br(v.spec)}</p>
<h3 style="margin:20px 0 4px">Quantity and phasing</h3>
<p>${nl2br(v.quantity)}</p>
<h3 style="margin:20px 0 4px">Details</h3>
<table cellpadding="4" cellspacing="0" style="border-collapse:collapse">
${rows
  .map(
    ([k, val]) =>
      `<tr><td style="vertical-align:top"><strong>${esc(
        k
      )}</strong></td><td style="vertical-align:top">${esc(val)}</td></tr>`
  )
  .join("\n")}
</table>
<p style="margin-top:20px">Reply to this email to answer ${esc(
    v.contactName
  )} directly.</p>`.trim();

  return {
    to: mailConfig.to,
    subject: `Enquiry — ${v.companyName} — ${
      verticalNames(v.verticals) || "unspecified vertical"
    }`,
    text,
    html,
    replyTo: v.email,
  };
}

/* ── Autoresponder: what the buyer gets ───────────────────────────────────── */

export function autoresponderEmail(v: EnquiryValues): MailMessage {
  const phones = contact.phones.join(" · ");

  const text = [
    `${v.contactName},`,
    "",
    "We have your enquiry. You will have a written quotation within 24 hours.",
    "",
    "If the enquiry is complete — specification, quantity, delivery PIN code and",
    "required-by date — the quotation carries a firm price and a lead time in",
    "writing. If anything is missing we will call you first.",
    "",
    "WHAT WE RECEIVED",
    "",
    v.spec,
    "",
    `Quantity: ${v.quantity}`,
    `Delivery: ${v.location} ${v.pin}`,
    `Required by: ${formatDate(v.requiredBy)}`,
    `Verticals: ${verticalNames(v.verticals)}`,
    "",
    "If any of that is wrong, reply to this email and we will correct it before",
    "quoting.",
    "",
    "THE FASTER PATH",
    "",
    phones,
    "",
    "—",
    company.legalName,
    `${contact.address.line1}, ${contact.address.line2}, ${contact.address.city} ${contact.address.pin}`,
    `${company.isoCertification.standard} certified · Cert. no. ${company.isoCertification.certificateNo}`,
  ].join("\n");

  const html = `
<p>${esc(v.contactName)},</p>
<p>We have your enquiry. <strong>You will have a written quotation within 24 hours.</strong></p>
<p>If the enquiry is complete — specification, quantity, delivery PIN code and required-by date — the quotation carries a firm price and a lead time in writing. If anything is missing we will call you first.</p>
<h3 style="margin:24px 0 4px">What we received</h3>
<p>${nl2br(v.spec)}</p>
<table cellpadding="4" cellspacing="0" style="border-collapse:collapse">
<tr><td style="vertical-align:top"><strong>Quantity</strong></td><td>${nl2br(
    v.quantity
  )}</td></tr>
<tr><td style="vertical-align:top"><strong>Delivery</strong></td><td>${esc(
    v.location
  )} ${esc(v.pin)}</td></tr>
<tr><td style="vertical-align:top"><strong>Required by</strong></td><td>${esc(
    formatDate(v.requiredBy)
  )}</td></tr>
<tr><td style="vertical-align:top"><strong>Verticals</strong></td><td>${esc(
    verticalNames(v.verticals)
  )}</td></tr>
</table>
<p>If any of that is wrong, reply to this email and we will correct it before quoting.</p>
<h3 style="margin:24px 0 4px">The faster path</h3>
<p>${contact.phones
    .map(
      (p) =>
        `<a href="tel:${esc(p.replace(/\s/g, ""))}">${esc(p)}</a>`
    )
    .join(" &middot; ")}</p>
<hr>
<p style="font-size:12px;color:#555">
${esc(company.legalName)}<br>
${esc(contact.address.line1)}, ${esc(contact.address.line2)}, ${esc(
    contact.address.city
  )} ${esc(contact.address.pin)}<br>
${esc(company.isoCertification.standard)} certified &middot; Cert. no. ${esc(
    company.isoCertification.certificateNo
  )}
</p>`.trim();

  return {
    to: [v.email],
    subject: "Your enquiry — quotation within 24 hours",
    text,
    html,
    replyTo: mailConfig.to[0],
  };
}
