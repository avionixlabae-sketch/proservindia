import type { Metadata } from "next";
import { company, contact, addressLines } from "@/content/company";
import { Container, Kicker, Section } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How Proserv Property Services Pvt. Ltd. collects, uses and retains the personal data submitted through the enquiry form, under the Digital Personal Data Protection Act, 2023.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/**
 * ⚠️ NOT LEGAL COPY — see NOTES.md item 8.
 *
 * The original handoff filed privacy and terms as "non-blocking, decide before
 * launch". Under India's Digital Personal Data Protection Act, 2023, a notice
 * is required at the point personal data is collected, and the enquiry form
 * collects name, email, phone, GSTIN and billing entity. This page exists so
 * the form is not live without one.
 *
 * It is drafted from what the site actually does, not from a template, but it
 * has not been reviewed by a lawyer. Two things must be filled in before
 * launch: the Data Protection Officer / grievance contact, and the retention
 * period the client actually operates.
 */

const sections = [
  {
    no: "01",
    title: "What we collect",
    body: [
      "Through the enquiry form: your name, company name, email address, phone number, delivery location and PIN code, required-by date, and — where you provide them — your GSTIN and billing entity.",
      "The specification, quantity and phasing you send us about what you want quoted.",
      "We do not run advertising trackers, we do not sell data, and we do not build profiles on visitors.",
    ],
  },
  {
    no: "02",
    title: "Why we collect it",
    body: [
      "To prepare and send your quotation, and to follow it up. The GSTIN and billing entity are used to raise the proforma and, if you place an order, the tax invoice.",
      "That is the only purpose. If we ever want to use your details for anything else, we will ask you first.",
    ],
  },
  {
    no: "03",
    title: "Who we share it with",
    body: [
      "Where a quotation requires an OEM or authorised channel partner to confirm availability or pricing, we share only what that supplier needs to quote — typically the specification, quantity and delivery PIN code. We do not pass on your contact details for marketing.",
      "Two processors handle the data on our behalf under contract: Vercel Inc., which hosts this website, and Resend (Plus Five Five, Inc.), which delivers the enquiry email and your confirmation. Neither uses the data for any purpose of its own.",
      // Keep this list accurate. If a CRM or a second mail provider is added,
      // it belongs here by name before it goes live.
    ],
  },
  {
    no: "04",
    title: "How long we keep it",
    body: [
      "Enquiries that do not result in an order are deleted 24 months after the last contact about them. We keep them that long because a buyer who asked for a quotation often returns within a procurement cycle, and the earlier specification saves them repeating it.",
      "Where an enquiry becomes an order, the associated records are retained for as long as tax, warranty and ISO 9001:2015 traceability obligations require, and then deleted.",
      "You can ask us to delete your details sooner. See below.",
    ],
  },
  {
    no: "05",
    title: "Your rights",
    body: [
      "Under the Digital Personal Data Protection Act, 2023 you may ask us for a summary of the personal data we hold about you, ask us to correct or complete it, ask us to erase it where we are no longer required to keep it, and withdraw a consent you previously gave.",
      "You may nominate another person to exercise these rights on your behalf in the event of death or incapacity.",
      "If we do not resolve a complaint to your satisfaction, you may escalate it to the Data Protection Board of India.",
    ],
  },
  {
    no: "06",
    title: "Security",
    body: [
      "The site is served over HTTPS and enquiry submissions are transmitted encrypted. Access to enquiry records is limited to the people who need them to prepare a quotation or fulfil an order.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="border-b-2 border-divider">
        <Container>
          <div className="py-12 md:py-16">
            <Kicker className="text-accent-700">
              Digital Personal Data Protection Act, 2023
            </Kicker>
            <h1 className="mt-4 max-w-[16ch]">Privacy notice.</h1>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.5]">
              This notice covers the personal data {company.legalName} collects
              through this website, which is the enquiry form and nothing else.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="max-w-[76ch]">
          {sections.map((s) => (
            <div key={s.no} className="border-t-2 border-divider py-8 first:border-t-0 first:pt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[64px_1fr] sm:gap-8">
                <p className="numeral m-0 text-[28px]">{s.no}</p>
                <div>
                  <h2 className="text-[25px]">{s.title}</h2>
                  {s.body.map((p) => (
                    <p key={p} className="mt-3 mb-0 text-[15px] leading-[1.6]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="border-t-2 border-divider py-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[64px_1fr] sm:gap-8">
              <p className="numeral m-0 text-[28px]">07</p>
              <div>
                <h2 className="text-[25px]">Contact us about your data</h2>
                <p className="mt-3 text-[15px] leading-[1.6]">
                  Our privacy contact answers questions about how we handle your
                  personal data, and any request to see, correct or delete it.
                  Write to the address below — the subject line is prefilled if
                  you use the link.
                </p>
                <p className="mt-3 mb-0 text-[15px]">
                  {/* Role-based rather than a named individual, so the notice
                      does not go stale when responsibility moves. DPDP asks for
                      contact details of a person able to respond; a monitored
                      functional address with a stated role satisfies that.
                      NOTE: privacyEmail must be a live, monitored mailbox
                      before launch — see NOTES.md item 3. */}
                  <a
                    href={`mailto:${contact.privacyEmail}?subject=Data%20request`}
                    className="font-semibold text-accent-700 underline underline-offset-2"
                  >
                    {contact.privacyEmail}
                  </a>
                </p>
                <p className="mt-2 mb-0 text-[15px] text-muted">
                  We respond to data requests within 30 days.
                </p>
                <address className="mt-3 not-italic text-[15px] leading-[1.6]">
                  {company.legalName}
                  {addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
