/** The five-step order flow, quality management list and regulatory notes. */

export interface ProcessStep {
  no: string;
  name: string;
  body: string;
}

export const process: ProcessStep[] = [
  {
    no: "01",
    name: "Enquiry",
    body: "You send a specification, drawing or OEM part number with quantity, delivery location and required-by date.",
  },
  {
    no: "02",
    name: "Sourcing and validation",
    body: "We source against the approved vendor list, confirm availability and validate the specification with the OEM or channel partner.",
  },
  {
    no: "03",
    name: "Quotation with firm lead time",
    body: "A written quotation within 24 hours of a complete enquiry, with the lead time stated in writing and not estimated verbally.",
  },
  {
    no: "04",
    name: "Inspection and dispatch",
    body: "Goods inward inspection against recorded criteria. Batch and serial records captured before dispatch; non-conformances raised and closed.",
  },
  {
    no: "05",
    name: "Delivery and after-sales",
    body: "Delivery to site with documentation, OEM warranty passed through in writing, and one escalation path across every category.",
  },
];

export const qualityManagement = [
  "Documented supplier evaluation and approval",
  "Goods inward inspection against recorded criteria",
  "Non-conformance reporting and corrective action",
  "Traceable batch and serial records on dispatch",
  "Internal audits and annual management review",
  "Customer complaint logging and closure tracking",
  "Approved vendor list with periodic re-evaluation",
  "Measured objectives: on-time delivery, quotation turnaround, order accuracy",
];

/** Indexed — verticals.ts → regulatory holds indices into this array. */
export const regulatoryNotes = [
  "BIS and ISI marked products where certification is mandatory",
  "BEE star-rated appliances with declared energy ratings",
  "Refrigerant handling per ODS Rules and India's HFC phase-down",
  "E-waste routed through CPCB authorised recyclers",
  "Building materials to relevant IS codes and NBC requirements",
  "OEM warranty passed through in writing on every invoice",
];
