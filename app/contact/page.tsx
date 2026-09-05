import type { Metadata } from "next";
import { Suspense } from "react";
import { contact, addressLines, enquiryRequirements } from "@/content/company";
import { vendorPack } from "@/content/documents";
import { Container, Kicker } from "@/components/primitives";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Request a quotation",
  description:
    "Send a specification, quantity, delivery PIN code and required-by date. Proserv returns a written quotation with a firm lead time within 24 hours of a complete enquiry.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <div className="border-b-2 border-divider">
        <Container>
          <div className="py-12 md:py-16">
            <Kicker className="text-accent-700">
              {contact.responseCommitment}
            </Kicker>
            <h1 className="mt-4 max-w-[16ch]">Request a quotation.</h1>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.5]">
              A complete enquiry gets a written quotation with a firm price and a
              lead time in writing. An incomplete one gets a phone call first —
              so the five fields below are what we actually need.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:py-16">
          <div>
            <Suspense
              fallback={
                <p className="text-[15px] text-muted">Loading the form…</p>
              }
            >
              <EnquiryForm />
            </Suspense>
          </div>

          <aside className="lg:border-l-2 lg:border-divider lg:pl-16">
            <h2 className="text-[25px]">{contact.responseCommitment}.</h2>
            <p className="mt-3 text-[15px]">
              Quotations are issued against the approved vendor list, with lead
              times confirmed in writing and never estimated verbally.
            </p>

            <div className="mt-10 border-t-2 border-divider pt-5">
              <Kicker className="text-accent-700">Address</Kicker>
              <address className="mt-3 not-italic text-[15px] leading-[1.6]">
                {addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </div>

            <div className="mt-8 border-t-2 border-divider pt-5">
              <Kicker className="text-accent-700">Phone</Kicker>
              <div className="mt-3">
                {contact.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="block min-h-[40px] py-1 text-[20px] font-extrabold text-ink no-underline hover:underline"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t-2 border-divider pt-5">
              <Kicker className="text-accent-700">Email</Kicker>
              <div className="mt-3">
                {contact.emails.map((e) => (
                  <a
                    key={e}
                    href={`mailto:${e}`}
                    className="block min-h-[36px] break-all py-1 text-[15px] font-semibold text-ink no-underline hover:underline"
                  >
                    {e}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t-2 border-divider pt-5">
              <Kicker className="text-accent-700">
                To get a quotation in 24 hours, send us
              </Kicker>
              <ol className="m-0 mt-3 list-none p-0">
                {enquiryRequirements.map((r, i) => (
                  <li
                    key={r}
                    className="flex gap-4 border-b-2 border-divider py-3 text-[14px] leading-[1.45] last:border-b-0"
                  >
                    <span className="shrink-0 font-extrabold tabular-nums text-accent-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div
              id="vendor-pack"
              className="mt-8 scroll-mt-24 border-t-2 border-divider pt-5"
            >
              <Kicker className="text-accent-700">Vendor onboarding</Kicker>
              <h3 className="mt-3 text-[20px]">{vendorPack.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.5]">{vendorPack.body}</p>
              <ul className="m-0 mt-3 list-none p-0 text-[14px]">
                {vendorPack.contents.map((c) => (
                  <li key={c} className="border-t-2 border-divider py-2">
                    {c}
                  </li>
                ))}
              </ul>
              {/* TODO: swap for a real download once the signed PDF bundle
                  exists — NOTES.md item 6. */}
              <p className="mt-4 mb-0 text-[14px] font-semibold">
                {vendorPack.fallback}
              </p>
              <a
                href={`mailto:${contact.emails[0]}?subject=${encodeURIComponent(
                  "Vendor registration pack request"
                )}`}
                className="btn btn-secondary mt-4"
              >
                Email for the vendor pack
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
