/**
 * Content for `/what-you-receive`.
 *
 * This page replaces the "Capabilities in practice" page in the original
 * handoff. See NOTES.md item 5.
 *
 * Split into two lists on purpose, and the split is the point:
 *
 *   documentTrail  — documents the buyer actually receives.
 *   internalRecords — records Proserv keeps as ISO 9001:2015 evidence and will
 *                     show for a specific consignment on request.
 *
 * The first draft put all of it under "what you receive", which overclaimed:
 * an inspection record and a non-conformance report are kept, not posted to the
 * customer. Separating them is more credible than merging them, because it
 * demonstrates the quality system without pretending the buyer gets a copy of
 * everything in it.
 *
 * Every line below was confirmed with the client on 5 September 2026 as
 * something Proserv genuinely produces today. Nothing here is aspirational.
 * If a line stops being true, remove it — the page's entire value is that a
 * procurement manager can check it.
 */

export interface DocumentStage {
  no: string;
  stage: string;
  when: string;
  documents: { name: string; note: string }[];
}

/** What the buyer receives. */
export const documentTrail: DocumentStage[] = [
  {
    no: "01",
    stage: "At quotation",
    when: "Within 24 hours of a complete enquiry",
    documents: [
      {
        name: "Written quotation",
        note: "Line-item pricing against your specification, with the lead time stated in writing and not estimated verbally.",
      },
      {
        name: "Proforma invoice",
        note: "Raised against your GSTIN and billing entity, so the purchase order can be released without a second round of paperwork.",
      },
      {
        name: "OEM technical datasheet",
        note: "The manufacturer's own specification for the make and model offered, so the quotation can be checked against your tender, drawing or bill of quantities.",
      },
    ],
  },
  {
    no: "02",
    stage: "On dispatch",
    when: "After goods inward inspection",
    documents: [
      {
        name: "Batch and serial record",
        note: "Traceable batch or serial numbers captured against the dispatch, so a warranty claim can be tied to a specific unit rather than to an order.",
      },
      {
        name: "BIS / ISI and BEE declarations",
        note: "Certification marks and declared energy ratings, where the product category requires them.",
      },
    ],
  },
  {
    no: "03",
    stage: "On delivery",
    when: "On arrival at your site",
    documents: [
      {
        name: "Tax invoice",
        note: "GST-compliant, matched to the proforma and the purchase order, with the OEM warranty passed through to you in writing on the invoice itself.",
      },
      {
        name: "E-way bill",
        note: "Generated for the movement where the consignment value requires it.",
      },
      {
        name: "Packing list and delivery challan",
        note: "Itemised against the order, so receiving can check the consignment without opening the order file.",
      },
    ],
  },
];

/**
 * What Proserv keeps. Available for a specific consignment on request.
 *
 * These are ISO 9001:2015 records, not customer deliverables. Stated as such —
 * a buyer auditing a vendor wants to know the records exist and can be produced,
 * which is a different and more defensible claim than saying they are sent.
 */
export const internalRecords = [
  {
    name: "Goods inward inspection record",
    note: "Every consignment checked against recorded criteria before it moves. The same criteria apply to a cement consignment and to a server rack.",
  },
  {
    name: "Non-conformance report and corrective action",
    note: "Raised where an inspection fails, with the corrective action recorded and closed before the consignment is released.",
  },
  {
    name: "Approved vendor list and supplier re-evaluation",
    note: "Suppliers are evaluated before approval and re-evaluated periodically. A supplier that fails repeatedly comes off the list.",
  },
  {
    name: "Customer complaint log",
    note: "Any issue you raise is logged and tracked to closure, rather than handled by conversation and forgotten.",
  },
  {
    name: "Measured objectives and management review",
    note: "On-time delivery, quotation turnaround and order accuracy are measured across the business and reviewed annually under ISO 9001:2015.",
  },
];

/** The vendor registration pack — also the secondary path on /contact. */
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
 * Real, client-approved case studies drop in here and render above the document
 * trail with no rebuild. Leave empty until the client approves sector, scope and
 * outcome. No client names required. See NOTES.md item 5.
 */
export interface CaseStudy {
  sectorSlug: string;
  title: string;
  scope: string[];
  outcome: string;
}

export const caseStudies: CaseStudy[] = [];
