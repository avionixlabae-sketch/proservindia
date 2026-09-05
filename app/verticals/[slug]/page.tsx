import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  verticals,
  verticalBySlug,
  supplyModelById,
} from "@/content/verticals";
import { sectorBySlug } from "@/content/sectors";
import { regulatoryNotes } from "@/content/process";
import { enquiryRequirements, company } from "@/content/company";
import { Container, Kicker, Section } from "@/components/primitives";
import { ClosingBanner } from "@/components/blocks";
import { JsonLd, serviceJsonLd } from "@/lib/site";

export function generateStaticParams() {
  return verticals.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = verticalBySlug(slug);
  if (!v) return {};
  return {
    title: `${v.name} — ${v.kicker}`,
    description: `${v.positioning} Supplied across India by ${company.legalName}, ISO 9001:2015 certified. Quotation within 24 hours of a complete enquiry.`,
    alternates: { canonical: `/verticals/${v.slug}` },
  };
}

export default async function VerticalDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = verticalBySlug(slug);
  if (!v) notFound();

  const half = Math.ceil(v.items.length / 2);
  const columns = [v.items.slice(0, half), v.items.slice(half)];

  return (
    <>
      <JsonLd data={serviceJsonLd(v.name, v.positioning, `/verticals/${v.slug}`)} />

      <div className="border-b-2 border-divider">
        <Container>
          <div className="py-10 md:py-14">
            <nav aria-label="Breadcrumb">
              <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 text-[13px]">
                <li>
                  <Link href="/verticals" className="text-muted no-underline hover:underline">
                    Verticals
                  </Link>
                </li>
                <li aria-hidden className="text-muted">
                  <ChevronRight size={13} />
                </li>
                <li className="font-semibold">{v.name}</li>
              </ol>
            </nav>

            <p className="display mt-8 mb-0 text-accent-700">{v.no}</p>
            <h1 className="mt-4 max-w-[16ch]">{v.name}</h1>
            <Kicker className="mt-3 text-muted">{v.kicker}</Kicker>
            <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.5]">
              {v.positioning}
            </p>
          </div>
        </Container>
      </div>

      {/* What we supply */}
      <Section>
        <Kicker className="text-accent-700">What we supply</Kicker>
        <h2 className="mt-3 max-w-[20ch]">
          {v.items.length} standing lines in this category.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {columns.map((col, i) => (
            <ul key={i} className="m-0 list-none p-0">
              {col.map((item) => (
                <li
                  key={item}
                  className="border-b-2 border-divider py-3 text-[15px] leading-[1.45] first:border-t-2 md:first:border-t-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Section>

      {/* Who buys it */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <Kicker className="text-accent-700">Who buys it</Kicker>
            <h2 className="mt-3 text-[25px]">Sectors that consolidate this category.</h2>
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
              {v.sectors.map((s) => {
                const sector = sectorBySlug(s);
                if (!sector) return null;
                return (
                  <li key={s}>
                    <Link href={`/verticals?sector=${s}`} className="tag">
                      {sector.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:border-l-2 lg:border-divider lg:pl-12">
            <Kicker className="text-accent-700">How it is supplied</Kicker>
            <h2 className="mt-3 text-[25px]">Lead time and availability.</h2>
            <dl className="m-0 mt-5">
              {v.supplyModels.map((id) => {
                const m = supplyModelById(id);
                return (
                  <div key={id} className="border-t-2 border-divider py-4">
                    <dt className="text-[16px] font-extrabold">{m.title}</dt>
                    <dd className="m-0 mt-2 text-[15px] leading-[1.55]">
                      {m.body}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </Section>

      {/* Compliance */}
      <Section>
        <Kicker className="text-accent-700">Compliance that applies</Kicker>
        <h2 className="mt-3 max-w-[24ch]">
          What is checked before this category is dispatched.
        </h2>
        <ul className="m-0 mt-8 list-none p-0">
          {v.regulatory.map((i, n) => (
            <li
              key={i}
              className="flex gap-5 border-b-2 border-divider py-4 first:border-t-2 text-[15px] leading-[1.45]"
            >
              {/* Numbered by position on this page, not by index in the source
                  list — otherwise the sequence reads 01, 05, 06. */}
              <span className="shrink-0 font-extrabold tabular-nums text-accent-700">
                {String(n + 1).padStart(2, "0")}
              </span>
              <span>{regulatoryNotes[i]}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Enquiry requirements */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <Kicker className="text-accent-700">
              To get a quotation in 24 hours, send us
            </Kicker>
            <h2 className="mt-3 text-[25px]">A complete enquiry.</h2>
            <ol className="m-0 mt-5 list-none p-0">
              {enquiryRequirements.map((r, i) => (
                <li
                  key={r}
                  className="flex gap-5 border-b-2 border-divider py-3 first:border-t-2 text-[15px]"
                >
                  <span className="shrink-0 font-extrabold tabular-nums text-accent-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:border-l-2 lg:border-divider lg:pl-12">
            <h2 className="text-[25px]">Enquire about {v.name.toLowerCase()}.</h2>
            <p className="mt-3 max-w-[46ch] text-[15px]">
              The enquiry form opens pre-scoped to this vertical. Add the
              specification, quantity and delivery PIN code and you have a
              complete enquiry.
            </p>
            <Link
              href={`/contact?vertical=${v.slug}`}
              className="btn btn-primary mt-6"
            >
              Request a quotation
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      <ClosingBanner
        title="One purchase order covers this and the other seven."
        body="Consolidating categories removes the vendor onboarding, the separate inspection standards and the question of who to chase."
        cta="See all eight verticals"
        href="/verticals"
      />
    </>
  );
}
