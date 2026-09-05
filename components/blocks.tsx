import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { company, complianceStrip } from "@/content/company";
import { verticals, type Vertical } from "@/content/verticals";
import { process } from "@/content/process";
import { sectors } from "@/content/sectors";
import { Container, Kicker } from "./primitives";

/* ── Compliance strip ─────────────────────────────────────────────────────── */

export function ComplianceStrip() {
  return (
    <div className="border-b-2 border-divider bg-surface">
      <Container>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-8 gap-y-2 p-0 py-4 text-[13px]">
          {complianceStrip.map((item, i) => (
            <li
              key={item}
              className={
                i === 0
                  ? "font-extrabold uppercase tracking-[0.06em]"
                  : "text-muted"
              }
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

/* ── Verticals grid ───────────────────────────────────────────────────────── */

export function VerticalCell({
  v,
  full = false,
}: {
  v: Vertical;
  full?: boolean;
}) {
  const items = full ? v.items : v.items.slice(0, 3);
  return (
    <Link
      href={`/verticals/${v.slug}`}
      className="group flex h-full flex-col p-6 text-ink no-underline transition-colors duration-150 ease-out hover:bg-accent-100"
    >
      <span className="numeral">{v.no}</span>
      <h3 className="mt-4 text-[20px]">{v.name}</h3>
      <Kicker className="mt-2 text-muted">{v.kicker}</Kicker>
      <ul className="m-0 mt-4 list-none space-y-0 p-0 text-[14px] leading-[1.5]">
        {items.map((item) => (
          <li key={item} className="border-t-2 border-divider py-2">
            {item}
          </li>
        ))}
      </ul>
      {!full && v.items.length > 3 ? (
        <span className="border-t-2 border-divider pt-2 text-[13px] text-muted">
          + {v.items.length - 3} more
        </span>
      ) : null}
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[13px] font-extrabold uppercase tracking-[0.08em] text-accent-700">
        View vertical
        <ArrowRight
          size={14}
          aria-hidden
          className="transition-transform duration-150 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
        />
      </span>
    </Link>
  );
}

/** Explicit 4 / 2 / 1 — never auto-fit. */
export function VerticalsGrid({
  items = verticals,
  full = false,
}: {
  items?: Vertical[];
  full?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="border-y-2 border-divider p-6">
        <p className="m-0 text-[15px]">
          No vertical is filtered to that sector. Send the specification anyway —
          the standing categories are not the limit of what we source.
        </p>
      </div>
    );
  }
  return (
    <div className="ruled grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {items.map((v) => (
        <VerticalCell key={v.slug} v={v} full={full} />
      ))}
    </div>
  );
}

/* ── Process ──────────────────────────────────────────────────────────────── */

export function ProcessRow({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="ruled grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
      {process.map((step) => (
        <div key={step.no} className="p-5">
          <span className="numeral text-[28px]">{step.no}</span>
          <h3 className="mt-3 text-[17px]">{step.name}</h3>
          {detailed ? (
            <p className="m-0 mt-2 text-[14px] leading-[1.5] text-muted">
              {step.body}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ── Sectors ──────────────────────────────────────────────────────────────── */

export function SectorList() {
  return (
    <div className="ruled grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {sectors.map((s) => (
        <div key={s.slug} className="p-5">
          <span className="text-[13px] font-extrabold tracking-[0.06em] text-accent-700">
            {s.no}
          </span>
          <p className="m-0 mt-2 text-[15px] font-semibold leading-[1.4]">
            {s.name}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Stat band ────────────────────────────────────────────────────────────── */

export function StatBand() {
  return (
    <Container>
      <div className="ruled grid-cols-2 lg:grid-cols-4">
        {company.headlineStats.map((s) => (
          <div key={s.label} className="px-5 py-10 first:pl-0">
            <p className="display m-0 text-accent-700">{s.value}</p>
            <p className="kicker mt-3 mb-0 text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* ── Closing banner ───────────────────────────────────────────────────────── */

/**
 * The one place an accent runs as a full field — and it is the brand PURPLE,
 * not the green. #f3f2f2 on #580098 is 10.06:1, so body-size type is safe here.
 * On the green it would be 3.42:1 and only display type would pass.
 */
export function ClosingBanner({
  title = "Send a specification. Get a firm price in 24 hours.",
  body = "One purchase order, one inspection standard, one accountable point of contact across all eight verticals.",
  cta = "Request a quotation",
  href = "/contact",
}: {
  title?: string;
  body?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <section className="on-purple bg-purple text-bg">
      <Container>
        <div className="py-14 md:py-20">
          <Kicker className="text-bg">
            {company.positioning} · {company.city}
          </Kicker>
          <h2 className="display-lg mt-4 max-w-[18ch] text-bg">{title}</h2>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.5] text-bg">
            {body}
          </p>
          <Link href={href} className="btn btn-on-purple mt-8">
            {cta}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
