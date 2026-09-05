/**
 * The document trail — content for `/what-you-receive`.
 *
 * This page replaces the "Capabilities in practice" page in the original
 * handoff. See NOTES.md item 5. The reason: the company profile contains no
 * case studies, and a page of illustrative "a warehouse operator typically
 * consolidates…" scenarios reads to a procurement manager as an absence of
 * projects. Every line below is instead something Proserv actually produces
 * against an order, derived from the profile's own quality-management and
 * regulatory commitments. Nothing here is claimed history.
 *
 * ⚠️ Each stage's documents must be confirmed against what Proserv actually
 * issues before launch — see NOTES.md item 5.
 */

export interface DocumentStage {
  no: string;
  stage: string;
  when: string;
  documents: { name: string; note: string }[];
}

export const documentTrail: DocumentStage[] = [
  {
    no: "01",
    stage: "At quotation",
    when: "Within 24 hours of a complete enquiry",
    documents: [
      {
        name: "Written quotation",
        note: "Line-item pricing against your specification, with the lead time stated in writing.",
      },
      {
        name: "Proforma invoice",
        note: "Raised against your GSTIN and billing entity, for release of the purchase order.",
      },
      {
        name: "Technical datasheet",
        note: "The OEM's own specification for the offered make and model, so the offer can be checked against the tender or drawing.",
      },
    ],
  },
  {
    no: "02",
    stage: "At order",
    when: "On receipt of your purchase order",
    documents: [
      {
        name: "Order acknowledgement",
        note: "Confirms accepted scope, quantity, phasing and the committed delivery window.",
      },
      {
        name: "Vendor registration pack",
        note: "PAN, GST certificate, UDYAM registration, ISO 9001:2015 certificate, IEC, LEI, bank details and a cancelled cheque — supplied as one file for your vendor master.",
      },
    ],
  },
  {
    no: "03",
    stage: "Before dispatch",
    when: "After goods inward inspection",
    documents: [
      {
        name: "Goods inward inspection record",
        note: "The consignment checked against recorded criteria. The same criteria apply to a cement consignment and to a server rack.",
      },
      {
        name: "Batch and serial record",
        note: "Traceable batch or serial numbers captured against the dispatch, so a warranty claim can be tied to a specific unit.",
      },
      {
        name: "BIS / ISI or BEE declaration",
        note: "Certification marks and declared energy ratings where the product category requires them.",
      },
      {
        name: "Non-conformance report",
        note: "Raised where an inspection fails, with the corrective action recorded and closed before the consignment moves.",
      },
    ],
  },
  {
    no: "04",
    stage: "At delivery",
    when: "On arrival at your site",
    documents: [
      {
        name: "Tax invoice",
        note: "GST-compliant, matched to the proforma and the purchase order.",
      },
      {
        name: "E-way bill",
        note: "Generated for the movement where the consignment value requires it.",
      },
      {
        name: "Packing list and delivery challan",
        note: "Itemised against the order so receiving can check the consignment without opening the order file.",
      },
      {
        name: "OEM warranty letter",
        note: "The manufacturer's warranty passed through to you in writing, not summarised on the invoice.",
      },
    ],
  },
  {
    no: "05",
    stage: "After delivery",
    when: "For the life of the warranty",
    documents: [
      {
        name: "Complaint log entry",
        note: "Any issue raised is logged and tracked to closure, not handled by conversation.",
      },
      {
        name: "Corrective action record",
        note: "Where a supply failure recurs, the supplier is re-evaluated against the approved vendor list.",
      },
      {
        name: "Performance against measured objectives",
        note: "On-time delivery, quotation turnaround and order accuracy are measured objectives under ISO 9001:2015 and can be reported against your account.",
      },
    ],
  },
];

/** The vendor registration pack — the secondary path on /contact. */
export const vendorPack = {
  title: "Vendor registration pack",
  body: "Most buyers need Proserv on their vendor master before a purchase order can be raised. The pack contains everything a finance or procurement team asks for, in one file.",
  contents: [
    "Certificate of incorporation and PAN",
    "GST registration certificate",
    "UDYAM (MSME) registration certificate",
    "ISO 9001:2015 certificate, no. 3029QAF25",
    "Importer-Exporter Code and LEI",
    "Bank details and a cancelled cheque",
  ],
  // TODO: replace with a real signed PDF bundle at /vendor-pack.pdf, or wire
  // this to an email-gated download. See NOTES.md item 6.
  href: null as string | null,
  fallback:
    "Email Sales@proservindia.in with your company name and we will send it the same working day.",
};

/**
 * Real, client-approved case studies drop in here and render in place of
 * nothing — the page is already structured for them. Leave empty until the
 * client approves sector, scope and outcome. No client names required.
 * See NOTES.md item 5.
 */
export interface CaseStudy {
  sectorSlug: string;
  title: string;
  scope: string[];
  outcome: string;
}

export const caseStudies: CaseStudy[] = [];
