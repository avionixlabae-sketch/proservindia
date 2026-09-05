import { company, contact, CIN } from "@/content/company";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://proservindia.in";

export const nav = [
  { href: "/verticals", label: "Verticals" },
  { href: "/what-you-receive", label: "What you receive" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Organization JSON-LD. Populated only from profile facts. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: company.legalName,
  alternateName: company.shortName,
  url: SITE_URL,
  description: company.who,
  foundingDate: String(company.incorporated),
  identifier: [
    { "@type": "PropertyValue", name: "CIN", value: CIN },
    {
      "@type": "PropertyValue",
      name: "GSTIN",
      value: "06AAMCP9745Q1ZC",
    },
    {
      "@type": "PropertyValue",
      name: "LEI",
      value: "335800PX4R4JRPQSIT70",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${contact.address.line1}, ${contact.address.line2}`,
    addressLocality: contact.address.city,
    addressRegion: contact.address.state,
    postalCode: contact.address.pin,
    addressCountry: "IN",
  },
  telephone: contact.phones,
  email: contact.emails[0],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "certification",
    name: `${company.isoCertification.standard} (Cert. No. ${company.isoCertification.certificateNo})`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: contact.phones[0],
    email: contact.emails[0],
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
};

export function serviceJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${url}`,
    serviceType: "Equipment procurement and supply",
    areaServed: { "@type": "Country", name: "India" },
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
