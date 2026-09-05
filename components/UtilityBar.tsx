import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { contact } from "@/content/company";
import { Container } from "./primitives";

/**
 * Thin utility bar above the header. Accent-100 fill, ink type — the only place
 * a tinted band runs full width outside the closing banner.
 */
export default function UtilityBar() {
  return (
    <div className="border-b-2 border-divider bg-accent-100">
      <Container>
        <div className="flex min-h-[40px] flex-wrap items-center gap-x-4 gap-y-1 py-2 text-[13px]">
          <span className="font-extrabold uppercase tracking-[0.08em]">
            Quotation desk
          </span>
          <span className="text-ink">{contact.responseCommitment}.</span>
          <Link
            href="/contact"
            className="ml-auto inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.08em] text-purple no-underline hover:underline"
          >
            Send an enquiry
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </Container>
    </div>
  );
}
