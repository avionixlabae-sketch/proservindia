"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { sectors } from "@/content/sectors";
import { verticals } from "@/content/verticals";
import { VerticalsGrid } from "./blocks";

const options = [{ slug: "all", short: "All" }, ...sectors];

/**
 * Client-side sector filter. No fetch — all eight verticals are compiled in and
 * the filter narrows the rendered set. State mirrors to ?sector= so a filtered
 * view is linkable, and the segmented control is arrow-key navigable per the
 * radiogroup pattern.
 */
export default function SectorFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("sector") ?? "all";
  const active = options.some((o) => o.slug === raw) ? raw : "all";
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (slug: string) => {
    router.replace(slug === "all" ? "/verticals" : `/verticals?sector=${slug}`, {
      scroll: false,
    });
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = (index + 1) % options.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + options.length) % options.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = options.length - 1;
    refs.current[next]?.focus();
    select(options[next].slug);
  };

  const shown =
    active === "all"
      ? verticals
      : verticals.filter((v) => v.sectors.includes(active));

  return (
    <>
      <div className="mb-8">
        {/* An h2, not a <p>: it heads the filter + grid section, and without it
            the cells' h3s follow the page h1 directly and break heading order. */}
        <h2 className="kicker mb-3 text-muted" id="sector-filter-label">
          Filter by sector
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="sector-filter-label"
          className="seg"
        >
          {options.map((o, i) => (
            <button
              key={o.slug}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active === o.slug}
              tabIndex={active === o.slug ? 0 : -1}
              onClick={() => select(o.slug)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="seg-opt"
            >
              {o.short}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-3 mb-0 text-[13px] text-muted">
          {shown.length} of {verticals.length} verticals
          {active === "all"
            ? ""
            : ` typically bought by ${
                sectors.find((s) => s.slug === active)?.name.toLowerCase() ?? ""
              }`}
          .
        </p>
      </div>

      <VerticalsGrid items={shown} full />
    </>
  );
}
