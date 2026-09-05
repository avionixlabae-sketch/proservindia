import type { ReactNode } from "react";

/**
 * Shared layout primitives.
 *
 * The system's organising devices are alignment and 2px rules — nothing floats,
 * nothing is decorated. Every section is bounded by a rule and everything inside
 * it starts at the same left edge.
 */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** A major page section, closed by a 2px rule. */
export function Section({
  children,
  className = "",
  rule = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  rule?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${rule ? "border-b-2 border-divider" : ""} ${className}`}
    >
      <Container className="py-12 md:py-16">{children}</Container>
    </section>
  );
}

/** Flush-left section marker, e.g. VERTICALS · CATEGORIES 01–08 OF 08. */
export function Kicker({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "h2" | "div";
}) {
  return <Tag className={`kicker ${className}`}>{children}</Tag>;
}

/** The heading block that opens most sections. */
export function SectionHead({
  kicker,
  title,
  lede,
  id,
}: {
  kicker: string;
  title: string;
  lede?: string;
  id?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <Kicker className="text-accent-700">{kicker}</Kicker>
      <h2 id={id} className="mt-3 max-w-[22ch]">
        {title}
      </h2>
      {lede ? <p className="mt-4 max-w-[62ch] text-muted">{lede}</p> : null}
    </div>
  );
}
