/**
 * Company facts. Every value here is transcribed from
 * `Proserv Company Profile 2026.pdf` unless a comment says otherwise.
 *
 * Do not edit a value without changing the profile too — the site and the
 * profile are read side by side by the same buyer.
 */

export const company = {
  legalName: "Proserv Property Services Pvt. Ltd.",
  shortName: "Proserv",
  positioning: "Procurement as a Service (PaaS)",
  city: "Gurugram",
  state: "Haryana",
  country: "India",
  incorporated: 2022,
  isoCertification: { standard: "ISO 9001:2015", certificateNo: "3029QAF25" },

  headlineStats: [
    { value: "8", label: "Verticals" },
    { value: "50+", label: "Supplier & OEM ties" },
    { value: "10+", label: "States served" },
    { value: "24 hrs", label: "Quotation turnaround" },
  ],

  mission:
    "Supply specified equipment on time, at a firm price, with documented quality checks on every consignment.",
  vision:
    "Be the single procurement partner Indian industrial and commercial buyers keep across every equipment category.",

  // Verbatim from the profile. Used as the hero lede — do not paraphrase.
  proposition:
    "Clients who would otherwise run eight vendor relationships run one, against one purchase order, one inspection standard and one accountable point of contact.",

  who: "Proserv Property Services Pvt. Ltd. is a Procurement as a Service (PaaS) company based in Gurugram, sourcing and supplying building materials, electrical systems, white goods, commercial refrigeration, HVAC, renewable energy materials, IT hardware and material handling equipment to industrial, commercial and institutional clients across India.",
} as const;

export const contact = {
  address: {
    line1: "Unit No. 540, 5th Floor, Tower A2",
    line2: "Spaze I-Tech Park, Sector 49, Sohna Road",
    city: "Gurugram",
    pin: "122018",
    state: "Haryana",
    country: "India",
  },
  phones: ["+91 99995 56525", "+91 73735 20007"],
  emails: ["Sales@proservindia.in", "Ajaypal@proservindia.in"],
  /**
   * Published on /privacy as the contact for data requests, kept separate from
   * the sales inbox so a deletion request does not queue behind quotations.
   * MUST be a live, monitored mailbox before launch — see NOTES.md item 3.
   */
  privacyEmail: "privacy@proservindia.in",
  website: "https://proservindia.in/",
  responseCommitment: "Quotation within 24 hours of a complete enquiry",
} as const;

export const addressLines = [
  contact.address.line1,
  contact.address.line2,
  `${contact.address.city} ${contact.address.pin}`,
  `${contact.address.state}, ${contact.address.country}`,
];

/**
 * CIN — verified by the client, 5 September 2026, and matches the 2026 company
 * profile. Third-party registries also list U46909HR2022PTC104279 against the
 * same registration number; that is stale aggregator data, not the current CIN.
 *
 * Kept as a single exported constant because this string appears in the footer
 * of every page, the compliance strip, the About statutory table, the OG image
 * and Organization JSON-LD. If it ever changes, change it HERE ONLY — nothing
 * else references the literal.
 */
export const CIN = "U70109HR2022PTC104279";

export const statutory = [
  { label: "CIN", value: CIN },
  { label: "GSTIN", value: "06AAMCP9745Q1ZC" },
  { label: "UDYAM", value: "UDYAM-HR-05-0187195" },
  { label: "IEC", value: "AAMCP9745Q" },
  { label: "LEI", value: "335800PX4R4JRPQSIT70" },
] as const;

export const statutoryLine = [
  `CIN ${CIN}`,
  "GSTIN 06AAMCP9745Q1ZC",
  "UDYAM-HR-05-0187195",
  "IEC AAMCP9745Q",
  "LEI 335800PX4R4JRPQSIT70",
  `ISO 9001:2015 Certified, Cert. No. ${company.isoCertification.certificateNo}`,
].join(" · ");

/** The compliance strip under the hero. Flat type, no badge graphics. */
export const complianceStrip = [
  "ISO 9001:2015",
  `CIN ${CIN}`,
  "GSTIN 06AAMCP9745Q1ZC",
  "UDYAM-HR-05-0187195",
  "IEC AAMCP9745Q",
];

/**
 * Where the company came from — the /about origin section.
 *
 * Not in the 2026 profile. Written from the founder's own account of why a
 * property services company moved into sourcing and supply, and it does real
 * work on this site: the legal name, the logo tagline and the CIN's activity
 * class all say property, while everything else says equipment. Without this
 * section a buyer verifying the company finds an unexplained gap. With it, the
 * property services origin becomes the reason the procurement business exists.
 */
export const origin = {
  kicker: "Where we started",
  title: "Property services came first. Procurement is what it turned into.",
  body: [
    "Proserv began as a property services company, and the name is not a leftover. Working with commercial real estate clients made one thing clear: managing a building is the smaller problem. The harder one is buying everything that goes into it, and everything that keeps it running afterwards.",
    "A single commercial fit-out can run separate vendor relationships for structural and finishing materials, HVAC plant, electrical and backup power, refrigeration, IT hardware, appliances and material handling. Each with its own onboarding, its own inspection standard, its own point of contact. The building is one project. The procurement is eight.",
    "So we extended into sourcing and supply, to cover the complete aspect of commercial real estate services rather than a part of it. One vendor agreement now covers both sides of a client's spend — what goes in at fit-out, and what the site keeps buying for as long as it runs.",
  ],
  closing:
    "The property services name is not history. It is the reason the procurement business exists.",
} as const;

/**
 * CAPEX and OPEX, as a buyer's budget is actually structured.
 *
 * The rest of the site organises by product vertical, which is how we source.
 * This is how the client's spend is approved — two different budget lines, two
 * different approval paths, usually two different people. Both examples lists
 * are drawn from the standing categories in verticals.ts; nothing new is
 * claimed here.
 */
export const spendTypes = [
  {
    label: "CAPEX",
    title: "What goes in",
    body: "Specified against a bill of quantities and delivered to the build programme, from foundation to handover.",
    examples: [
      "Structure, envelope and finishing materials",
      "HVAC plant, chillers and refrigeration systems",
      "Electrical infrastructure, transformers and backup power",
      "Material handling fleet and storage systems",
      "IT hardware at build-out",
      "Solar generation and balance of system",
    ],
  },
  {
    label: "OPEX",
    title: "What keeps it running",
    body: "Ordered against the same vendor agreement once the site is live, without a second onboarding.",
    examples: [
      "Replacements, spares and consumable parts",
      "Appliance and endpoint refresh cycles",
      "Cables, conduit and site supply",
      "Safety equipment, PPE and signage",
      "Hand and power tools",
      "Additional capacity as the site expands",
    ],
  },
] as const;

/** The profile's "one vendor, not seven" argument. Three columns on Home. */
export const argument = [
  {
    title: "Fewer contracts",
    body: "One vendor agreement, one set of KYC documents, one payment relationship instead of separate onboarding per category.",
  },
  {
    title: "Consistent quality control",
    body: "The same inspection criteria and non-conformance procedure apply to a cement consignment and to a server rack.",
  },
  {
    title: "One point of accountability",
    body: "When a delivery slips, there is no question of which supplier to chase.",
  },
] as const;

export const commitments = [
  "Documented quality management",
  "Firm written lead times",
  "Single-window multi-category supply",
  "OEM warranty pass-through",
  "Transparent GST invoicing",
  "Pan-India logistics coverage",
  "Technical selection support",
  "One escalation path across every category",
] as const;

/** What a buyer must send to get the 24-hour quotation. Drives the form. */
export const enquiryRequirements = [
  "Item description, specification or OEM part number",
  "Quantity and any phasing across deliveries",
  "Delivery location and PIN code",
  "Required-by date",
  "GSTIN and billing entity for the proforma",
] as const;
