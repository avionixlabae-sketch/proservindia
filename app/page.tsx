import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { company, argument } from "@/content/company";
import { verticalsCaveat } from "@/content/verticals";
import { Container, Kicker, Section, SectionHead } from "@/components/primitives";
import {
  ClosingBanner,
  ComplianceStrip,
  ProcessRow,
  SectorList,
  StatBand,
  VerticalsGrid,
} from "@/components/blocks";
import SpecBlock from "@/components/SpecBlock";
import { JsonLd, serviceJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Equipment procurement across eight verticals, one purchase order · Proserv",
  description:
    "Proserv is a Procurement as a Service company in Gurugram supplying building materials, electrical, HVAC, refrigeration, IT hardware, material handling, white goods and renewable energy equipment across India. ISO 9001:2015 certified. Quotation within 24 hours.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          "Procurement as a Service",
          company.who,
          "/"
        )}
      />

      {/* Hero */}
      <div className="border-b-2 border-divider">
        <Container>
          <div className="grid grid-cols-1 gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <Kicker className="text-accent-700">
                {company.positioning} · {company.city}
              </Kicker>
              <h1 className="mt-4 max-w-[13ch]">
                Eight equipment verticals. One purchase order.
              </h1>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.5]">
                {company.proposition}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary">
                  Request a quotation
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link href="/verticals" className="btn btn-secondary">
                  See the eight verticals
                </Link>
              </div>
            </div>
            <SpecBlock />
          </div>
        </Container>
      </div>

      <ComplianceStrip />

      {/* One vendor, not seven */}
      <Section>
        <SectionHead
          kicker="The argument"
          title="One vendor, not seven."
          lede="Multi-category buying is usually a procurement problem before it is a supply problem. Consolidating it changes three things."
        />
        <div className="ruled grid-cols-1 lg:grid-cols-3">
          {argument.map((a) => (
            <div key={a.title} className="p-6 lg:first:pl-0">
              <h3 className="text-[20px]">{a.title}</h3>
              <p className="m-0 mt-3 text-[15px] leading-[1.55]">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Verticals */}
      <Section>
        <SectionHead
          kicker="Verticals · categories 01–08 of 08"
          title="What we supply."
          lede="Eight standing categories, sourced from verified OEMs and authorised channel partners against a single vendor agreement."
        />
        <VerticalsGrid />
        <p className="mt-8 max-w-[70ch] text-[17px] font-semibold leading-[1.45]">
          {verticalsCaveat}
        </p>
        <Link href="/verticals" className="btn btn-ghost mt-2">
          All eight verticals in full
          <ArrowRight size={16} aria-hidden />
        </Link>
      </Section>

      {/* Process */}
      <Section>
        <SectionHead
          kicker="Enquiry to after-sales"
          title="How an order runs."
          lede="The same five steps apply to a cement consignment and to a server rack. Lead times are confirmed in writing at quotation stage, never estimated verbally."
        />
        <ProcessRow detailed />
        <Link href="/what-you-receive" className="btn btn-ghost mt-6">
          The documents you receive at each stage
          <ArrowRight size={16} aria-hidden />
        </Link>
      </Section>

      {/* Sectors */}
      <Section>
        <SectionHead
          kicker="Eight buyer types · one vendor agreement"
          title="Sectors we supply."
        />
        <SectorList />
      </Section>

      <StatBand />

      <ClosingBanner />
    </>
  );
}
