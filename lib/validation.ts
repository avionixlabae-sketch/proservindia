/** Shared between the client form and the server route — one source of truth. */

export interface EnquiryValues {
  spec: string;
  verticals: string[];
  quantity: string;
  location: string;
  pin: string;
  requiredBy: string;
  gstin: string;
  billingEntity: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  /** Honeypot. Real users never fill this; bots do. */
  website: string;
}

export const emptyEnquiry: EnquiryValues = {
  spec: "",
  verticals: [],
  quantity: "",
  location: "",
  pin: "",
  requiredBy: "",
  gstin: "",
  billingEntity: "",
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
};

const PIN = /^[1-9][0-9]{5}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// 10-digit Indian mobile starting 6-9, optional +91 / 0 prefix.
const PHONE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;
// Standard 15-character GSTIN: 2-digit state, 10-char PAN, entity, Z, checksum.
const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export type Errors = Partial<Record<keyof EnquiryValues, string>>;

export function validate(v: EnquiryValues): Errors {
  const e: Errors = {};

  if (!v.spec.trim())
    e.spec = "Tell us what to quote — a description, specification or OEM part number.";
  if (v.verticals.length === 0)
    e.verticals = "Select at least one vertical.";
  if (!v.quantity.trim())
    e.quantity = "Quantity is required. Add any phasing across deliveries.";
  if (!v.location.trim()) e.location = "Delivery location is required.";

  if (!v.pin.trim()) e.pin = "PIN code is required.";
  else if (!PIN.test(v.pin.trim()))
    e.pin = "Enter a valid 6-digit Indian PIN code.";

  if (!v.requiredBy) e.requiredBy = "Required-by date is required.";
  else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${v.requiredBy}T00:00:00`) < today)
      e.requiredBy = "The required-by date cannot be in the past.";
  }

  if (v.gstin.trim() && !GSTIN.test(v.gstin.trim().toUpperCase()))
    e.gstin = "That is not a valid 15-character GSTIN.";

  if (!v.companyName.trim()) e.companyName = "Company name is required.";
  if (!v.contactName.trim()) e.contactName = "Contact name is required.";

  if (!v.email.trim()) e.email = "Email is required.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address.";

  if (!v.phone.trim()) e.phone = "Phone is required.";
  else if (!PHONE.test(v.phone.replace(/[\s-]/g, "")))
    e.phone = "Enter a 10-digit Indian mobile number.";

  return e;
}
