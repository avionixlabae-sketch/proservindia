import Link from "next/link";
import Image from "next/image";
import {
  company,
  contact,
  addressLines,
  statutoryLine,
} from "@/content/company";
import { verticals } from "@/content/verticals";
import { Container } from "./primitives";

const companyLinks = [
  { href: "/verticals", label: "Verticals" },
  { href: "/what-you-receive", label: "What you receive" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Request a quotation" },
  { href: "/privacy", label: "Privacy notice" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-divider">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <h2 className="kicker text-accent-700">Verticals</h2>
            <ul className="mt-4 space-y-2">
              {verticals.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/verticals/${v.slug}`}
                    className="text-[14px] text-ink no-underline hover:underline"
                  >
                    {v.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="kicker text-accent-700">Company</h2>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-ink no-underline hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="kicker text-accent-700">Contact</h2>
            <address className="mt-4 not-italic text-[14px] leading-[1.6]">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="mt-3 block">
                {contact.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="flex min-h-[44px] items-center text-ink no-underline hover:underline"
                  >
                    {p}
                  </a>
                ))}
              </span>
              <span className="mt-3 block">
                {contact.emails.map((e) => (
                  <a
                    key={e}
                    href={`mailto:${e}`}
                    className="flex min-h-[44px] items-center break-all text-ink no-underline hover:underline"
                  >
                    {e}
                  </a>
                ))}
              </span>
            </address>
          </div>

          <div>
            <h2 className="kicker text-accent-700">Credentials</h2>
            <ul className="mt-4 space-y-2 text-[14px]">
              <li>
                {company.isoCertification.standard} certified
                <span className="block text-muted">
                  Cert. no. {company.isoCertification.certificateNo}
                </span>
              </li>
              <li>
                Incorporated {company.incorporated}
                <span className="block text-muted">
                  {company.state}, {company.country}
                </span>
              </li>
              <li>
                {company.positioning}
                <span className="block text-muted">
                  Eight verticals, one purchase order
                </span>
              </li>
            </ul>
            <Image
              src="/proserv-logo.png"
              alt=""
              aria-hidden
              width={1116}
              height={202}
              className="mt-6 h-[26px] w-auto"
            />
          </div>
        </div>
      </Container>

      <div className="border-t-2 border-divider">
        <Container>
          <div className="flex flex-col gap-2 py-5 text-[12px] leading-[1.6] text-muted">
            <p className="m-0 break-words">{statutoryLine}</p>
            <p className="m-0">
              © {new Date().getFullYear()} {company.legalName}. All rights
              reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
