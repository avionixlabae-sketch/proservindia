"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { verticals } from "@/content/verticals";

/**
 * "Send a specification" — the hero's enquiry shortcut.
 *
 * This is NOT a search. There is no catalogue behind it and no lookup happens.
 * It routes to /contact with the value pre-filled, so a buyer who arrives with a
 * part number in hand can start the enquiry from the first screen.
 */
export default function SpecBlock() {
  const [spec, setSpec] = useState("");
  const router = useRouter();

  return (
    <form
      className="lg:border-l-2 lg:border-divider lg:pl-8"
      onSubmit={(e) => {
        e.preventDefault();
        const q = spec.trim();
        router.push(q ? `/contact?spec=${encodeURIComponent(q)}` : "/contact");
      }}
    >
      <h2 className="kicker text-accent-700">Send a specification</h2>
      <p className="mt-3 mb-0 max-w-[46ch] text-[15px]">
        Send a specification, a drawing or an OEM part number and we will revert
        with availability, lead time and a firm price.
      </p>

      <div className="field mt-6 mb-0">
        <label htmlFor="hero-spec">Item, specification or OEM part number</label>
        <input
          id="hero-spec"
          name="spec"
          type="text"
          className="input"
          placeholder="e.g. VRF outdoor unit, 16 HP"
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          autoComplete="off"
        />
      </div>

      <button type="submit" className="btn btn-primary mt-3 w-full">
        Continue to enquiry
        <ArrowRight size={16} aria-hidden />
      </button>

      <p className="kicker mt-8 mb-0 text-muted">Or start from a vertical</p>
      <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
        {verticals.map((v) => (
          <li key={v.slug}>
            <a className="tag" href={`/contact?vertical=${v.slug}`}>
              {v.name}
            </a>
          </li>
        ))}
      </ul>
    </form>
  );
}
