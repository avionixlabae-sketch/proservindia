import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { contact } from "@/content/company";
import { Container, Kicker } from "@/components/primitives";

export default function NotFound() {
  return (
    <Container>
      <div className="py-20 md:py-28">
        <Kicker className="text-accent-700">404</Kicker>
        <h1 className="mt-4 max-w-[16ch]">That page is not here.</h1>
        <p className="mt-5 max-w-[54ch] text-[17px]">
          The enquiry desk still is. Send a specification, a drawing or an OEM
          part number and we will revert with availability, lead time and a firm
          price.
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
        <p className="mt-8 mb-0 text-[15px]">
          Or call{" "}
          <a
            href={`tel:${contact.phones[0].replace(/\s/g, "")}`}
            className="font-semibold text-accent-700"
          >
            {contact.phones[0]}
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
