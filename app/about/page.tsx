import type { Metadata } from "next";
import {
  company,
  commitments,
  statutory,
  origin,
  spendTypes,
} from "@/content/company";
import { qualityManagement } from "@/content/process";
import { Container, Kicker, Section } from "@/components/primitives";
import { ClosingBanner, SectorList } from "@/components/blocks";

export const metadata: Metadata = {
  title: "About — a Procurement as a Service company in Gurugram",
  description:
    "Proserv Property Services Pvt. Ltd. was incorporated in Haryana in 2022 and extended from commercial real estate services into sourcing and supply — one vendor agreement covering both the CAPEX of a fit-out and the OPEX that follows. ISO 9001:2015 certified, cert. no. 3029QAF25.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="border-b-2 border-divider">
        <Container>
          <div className="py-12 md:py-16">
            <Kicker className="text-accent-700">
              Who we are · {company.positioning}
            </Kicker>
            <h1 className="mt-4 max-w-[18ch]">
              A single procurement partner across eight equipment categories.
            </h1>
            <p className="mt-5 max-w-[68ch] text-[17px] leading-[1.5]">
              {company.who}
            </p>
            <p className="mt-4 max-w-[68ch] text-[17px] font-semibold leading-[1.5]">
              {company.proposition}
            </p>
          </div>
        </Container>
      </div>

      {/* Origin — why a property services company supplies equipment. */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <Kicker className="text-accent-700">{origin.kicker}</Kicker>
            <h2 className="mt-3 max-w-[18ch]">{origin.title}</h2>
          </div>
          <div>
            {origin.body.map((p) => (
              <p key={p} className="mb-4 max-w-[64ch] text-[16px] leading-[1.6]">
                {p}
              </p>
            ))}
            <p className="mt-6 mb-0 max-w-[52ch] border-t-2 border-divider pt-5 text-[21px] font-extrabold leading-[1.3] tracking-[-0.015em]">
              {origin.closing}
            </p>
          </div>
        </div>

        <div className="mt-14">
          <Kicker className="text-accent-700">
            One agreement · both sides of the spend
          </Kicker>
          <p className="mt-3 mb-0 max-w-[62ch] text-[15px]">
            The rest of this site is organised by category, because that is how
            we source. This is how a client&rsquo;s budget is approved.
          </p>
          <div className="ruled mt-8 grid-cols-1 lg:grid-cols-2">
            {spendTypes.map((s) => (
              <div key={s.label} className="p-6 lg:first:pl-0">
                <p className="numeral m-0 text-[28px]">{s.label}</p>
                <h3 className="mt-3 text-[20px]">{s.title}</h3>
                <p className="mt-2 mb-0 max-w-[46ch] text-[15px] leading-[1.55]">
                  {s.body}
                </p>
                <ul className="m-0 mt-5 list-none p-0">
                  {s.examples.map((e) => (
                    <li
                      key={e}
                      className="border-t-2 border-divider py-2 text-[14px] leading-[1.45]"
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Mission / vision */}
      <Section>
        <div className="ruled grid-cols-1 lg:grid-cols-2">
          <div className="p-6 lg:pl-0">
            <Kicker className="text-accent-700">Mission</Kicker>
            <p className="m-0 mt-4 text-[21px] font-extrabold leading-[1.3] tracking-[-0.015em]">
              {company.mission}
            </p>
          </div>
          <div className="p-6">
            <Kicker className="text-accent-700">Vision</Kicker>
            <p className="m-0 mt-4 text-[21px] font-extrabold leading-[1.3] tracking-[-0.015em]">
              {company.vision}
            </p>
          </div>
        </div>
        <p className="mt-8 mb-0 text-[15px] text-muted">
          Incorporated in {company.state} in {company.incorporated}. Registered
          office in {company.city}, supplying across {company.country}.
        </p>
      </Section>

      {/* Sectors */}
      <Section>
        <Kicker className="text-accent-700">
          Eight buyer types · one vendor agreement
        </Kicker>
        <h2 className="mt-3 max-w-[20ch]">Who we supply.</h2>
        <div className="mt-8">
          <SectorList />
        </div>
      </Section>

      {/* Quality management */}
      <Section>
        <Kicker className="text-accent-700">
          {company.isoCertification.standard} certified · cert. no.{" "}
          {company.isoCertification.certificateNo}
        </Kicker>
        <h2 className="mt-3 max-w-[22ch]">Quality management.</h2>
        <p className="mt-4 max-w-[62ch] text-[15px]">
          The same procedures apply to every category. They are the reason a
          multi-vertical purchase order does not become eight different
          inspection standards.
        </p>
        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-x-12 p-0 md:grid-cols-2">
          {qualityManagement.map((q, i) => (
            <li
              key={q}
              className="flex gap-5 border-b-2 border-divider py-4 text-[15px] leading-[1.45] first:border-t-2 md:[&:nth-child(2)]:border-t-2"
            >
              <span className="shrink-0 font-extrabold tabular-nums text-accent-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Statutory standing */}
      <Section>
        <Kicker className="text-accent-700">Statutory standing</Kicker>
        <h2 className="mt-3 max-w-[24ch]">Registrations, in full.</h2>
        <p className="mt-4 max-w-[62ch] text-[15px]">
          Every identifier below is verifiable against the issuing registry. They
          are printed here, in the footer of every page, and supplied in the
          vendor registration pack.
        </p>
        <div className="mt-8 max-w-[720px]">
          <table className="table">
            <caption className="sr-only">
              Statutory registrations for {company.legalName}
            </caption>
            <tbody>
              {statutory.map((s) => (
                <tr key={s.label}>
                  <th scope="row">{s.label}</th>
                  <td>{s.value}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">ISO</th>
                <td>
                  {company.isoCertification.standard} · Cert. no.{" "}
                  {company.isoCertification.certificateNo}
                </td>
              </tr>
              <tr>
                <th scope="row">Incorporated</th>
                <td>
                  {company.incorporated} · {company.state}, {company.country}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Commitment */}
      <Section>
        <Kicker className="text-accent-700">Our commitment</Kicker>
        <h2 className="mt-3 max-w-[22ch]">Eight things a buyer can hold us to.</h2>
        <ul className="ruled mt-8 grid-cols-1 list-none p-0 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((c, i) => (
            <li key={c} className="p-5">
              <span className="text-[13px] font-extrabold tabular-nums tracking-[0.06em] text-accent-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="m-0 mt-2 text-[15px] font-semibold leading-[1.4]">
                {c}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <ClosingBanner
        title="Put the registrations to work."
        body="Send a specification with quantity, delivery PIN code and required-by date, and the quotation follows within 24 hours."
      />
    </>
  );
}
