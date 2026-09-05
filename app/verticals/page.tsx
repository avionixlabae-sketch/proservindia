import type { Metadata } from "next";
import { Suspense } from "react";
import { supplyModels, verticalsCaveat, verticals } from "@/content/verticals";
import { Container, Kicker, Section } from "@/components/primitives";
import { ClosingBanner, VerticalsGrid } from "@/components/blocks";
import SectorFilter from "@/components/SectorFilter";
import { JsonLd, serviceJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verticals — the eight categories we supply",
  description:
    "Building materials, white goods, commercial refrigeration, electrical and electronics, HVAC and cooling, IT hardware, material handling and renewable energy. Stock-backed lines and indent project supply, quoted within 24 hours.",
  alternates: { canonical: "/verticals" },
};

export default function VerticalsPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          "Multi-category equipment supply",
          "Eight standing equipment categories supplied against a single vendor agreement across India.",
          "/verticals"
        )}
      />

      <div className="border-b-2 border-divider">
        <Container>
          <div className="py-12 md:py-16">
            <Kicker className="text-accent-700">
              Verticals · categories 01–08 of 08
            </Kicker>
            <h1 className="mt-4 max-w-[16ch]">
              Eight standing categories. One vendor agreement.
            </h1>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.5]">
              Every category below is sourced from verified OEMs and authorised
              channel partners, inspected against the same recorded criteria, and
              invoiced under one GSTIN. Filter by the sector you buy for.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <Suspense fallback={<VerticalsGrid items={verticals} full />}>
          <SectorFilter />
        </Suspense>
      </Section>

      <Section>
        <Kicker className="text-accent-700">Availability</Kicker>
        <h2 className="mt-3 max-w-[20ch]">How a category is supplied.</h2>
        <div className="ruled mt-8 grid-cols-1 lg:grid-cols-2">
          {supplyModels.map((m) => (
            <div key={m.id} className="p-6 lg:first:pl-0">
              <h3 className="text-[20px]">{m.title}</h3>
              <p className="m-0 mt-3 text-[15px] leading-[1.55]">{m.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-[70ch] text-[21px] font-extrabold leading-[1.25] tracking-[-0.015em]">
          {verticalsCaveat}
        </p>
      </Section>

      <ClosingBanner
        title="Not on the list? Send it anyway."
        body="A specification, a drawing or an OEM part number is enough. We revert with availability, lead time and a firm price."
        cta="Send a specification"
      />
    </>
  );
}
