import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { documentTrail, caseStudies, vendorPack } from "@/content/documents";
import { sectorBySlug } from "@/content/sectors";
import { company } from "@/content/company";
import { Container, Kicker, Section } from "@/components/primitives";
import { ClosingBanner } from "@/components/blocks";

export const metadata: Metadata = {
  title: "What you receive — the document trail on every order",
  description:
    "Quotation, proforma, inspection record, batch and serial traceability, BIS and BEE declarations, GST invoice, e-way bill and OEM warranty letter. The paperwork an ISO 9001:2015 certified supplier produces against a purchase order.",
  alternates: { canonical: "/what-you-receive" },
};

/**
 * Replaces the "Capabilities in practice" page from the original handoff.
 *
 * That page would have shown illustrative "a warehouse operator typically
 * consolidates…" scenarios, because the company profile contains no case
 * studies. To the procurement manager this site is written for, hypothetical
 * scenarios read as an absence of projects. This page instead documents what
 * Proserv actually issues against an order — all of it derived from the
 * profile's own quality-management and regulatory commitments, none of it
 * claimed history. Real case studies, when approved, render above the trail
 * from content/documents.ts → caseStudies with no rebuild.
 */
export default function WhatYouReceivePage() {
  return (
    <>
      <div className="border-b-2 border-divider">
        <Container>
          <div className="py-12 md:py-16">
            <Kicker className="text-accent-700">
              Governance · enquiry to warranty
            </Kicker>
            <h1 className="mt-4 max-w-[18ch]">
              What you receive, at every stage of the order.
            </h1>
            <p className="mt-5 max-w-[64ch] text-[17px] leading-[1.5]">
              A documented supply chain is the difference between a trader and a
              vendor you can put on a purchase order. Below is the paperwork an{" "}
              {company.isoCertification.standard} certified supplier produces
              against an order, in the sequence you receive it.
            </p>
          </div>
        </Container>
      </div>

      {caseStudies.length > 0 ? (
        <Section>
          <Kicker className="text-accent-700">Selected supply</Kicker>
          <h2 className="mt-3 max-w-[20ch]">Recent multi-vertical orders.</h2>
          <div className="ruled mt-8 grid-cols-1 lg:grid-cols-2">
            {caseStudies.map((c) => (
              <article key={c.title} className="p-6 lg:first:pl-0">
                <Kicker className="text-muted">
                  {sectorBySlug(c.sectorSlug)?.name ?? c.sectorSlug}
                </Kicker>
                <h3 className="mt-3 text-[20px]">{c.title}</h3>
                <ul className="m-0 mt-4 list-none p-0">
                  {c.scope.map((s) => (
                    <li
                      key={s}
                      className="border-t-2 border-divider py-2 text-[14px]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="m-0 mt-4 text-[15px]">{c.outcome}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {documentTrail.map((stage) => (
        <Section key={stage.no}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
            <div>
              <p className="display-lg m-0 text-accent-700">{stage.no}</p>
              <h2 className="mt-4 text-[25px]">{stage.stage}</h2>
              <Kicker className="mt-3 text-muted">{stage.when}</Kicker>
            </div>
            <div className="lg:border-l-2 lg:border-divider lg:pl-12">
              <dl className="m-0">
                {stage.documents.map((d) => (
                  <div
                    key={d.name}
                    className="border-b-2 border-divider py-4 first:border-t-2"
                  >
                    <dt className="text-[16px] font-extrabold">{d.name}</dt>
                    <dd className="m-0 mt-2 max-w-[64ch] text-[15px] leading-[1.5] text-muted">
                      {d.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>
      ))}

      {/* Vendor pack */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <Kicker className="text-accent-700">Before the first order</Kicker>
            <h2 className="mt-3 text-[25px]">{vendorPack.title}</h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.55]">
              {vendorPack.body}
            </p>
            <Link href="/contact#vendor-pack" className="btn btn-primary mt-6">
              Request the vendor pack
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="lg:border-l-2 lg:border-divider lg:pl-12">
            <ul className="m-0 list-none p-0">
              {vendorPack.contents.map((c, i) => (
                <li
                  key={c}
                  className="flex gap-5 border-b-2 border-divider py-3 text-[15px] first:border-t-2"
                >
                  <span className="shrink-0 font-extrabold tabular-nums text-accent-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <ClosingBanner
        title="Every order runs on the same paperwork."
        body="Send a complete enquiry and the quotation, with the lead time in writing, follows within 24 hours."
      />
    </>
  );
}
