"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { verticals } from "@/content/verticals";
import { contact } from "@/content/company";
import {
  emptyEnquiry,
  validate,
  type EnquiryValues,
  type Errors,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

/** Module-level so it is not re-created on every render. */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

export default function EnquiryForm() {
  const params = useSearchParams();
  const [values, setValues] = useState<EnquiryValues>(emptyEnquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryValues, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const successRef = useRef<HTMLDivElement>(null);

  // Prefill from ?spec= and ?vertical=, set by the hero block and the vertical
  // detail CTAs. Adjusted during render rather than in an effect, so the first
  // paint already carries the prefilled values.
  const queryKey = params.toString();
  const [seededKey, setSeededKey] = useState<string | null>(null);
  if (seededKey !== queryKey) {
    setSeededKey(queryKey);
    const spec = params.get("spec");
    const vertical = params.get("vertical");
    if (spec || vertical) {
      setValues((v) => ({
        ...v,
        spec: spec ?? v.spec,
        verticals:
          vertical && verticals.some((x) => x.slug === vertical)
            ? Array.from(new Set([...v.verticals, vertical]))
            : v.verticals,
      }));
    }
  }

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = <K extends keyof EnquiryValues>(k: K, val: EnquiryValues[K]) => {
    const next = { ...values, [k]: val };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };

  const blur = (k: keyof EnquiryValues) => {
    const t = { ...touched, [k]: true };
    setTouched(t);
    setErrors(validate(values));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched(
      Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Record<
        keyof EnquiryValues,
        boolean
      >
    );
    if (Object.keys(found).length > 0) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const err = (k: keyof EnquiryValues) => (touched[k] ? errors[k] : undefined);

  const fieldProps = (k: keyof EnquiryValues) => ({
    id: k,
    name: k,
    className: "input",
    "aria-invalid": err(k) ? ("true" as const) : undefined,
    "aria-describedby": err(k) ? `${k}-error` : undefined,
    onBlur: () => blur(k),
  });

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border-y-2 border-divider py-10"
      >
        <p className="kicker text-accent-700">Enquiry received</p>
        <h2 className="mt-4 max-w-[18ch] text-[32px]">
          We will come back with a quotation within 24 hours.
        </h2>
        <p className="mt-4 max-w-[54ch] text-[15px]">
          If the enquiry is complete — specification, quantity, delivery PIN code
          and required-by date — the quotation carries a firm price and a lead
          time in writing. If anything is missing we will call you first.
        </p>
        <p className="mt-6 mb-2 kicker text-muted">The faster path</p>
        <ul className="m-0 list-none p-0">
          {contact.phones.map((p) => (
            <li key={p} className="border-t-2 border-divider py-3">
              <a
                href={`tel:${p.replace(/\s/g, "")}`}
                className="text-[20px] font-extrabold text-ink no-underline hover:underline"
              >
                {p}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="kicker mb-6 text-accent-700">
          What you need quoted
        </legend>

        <div className="field">
          <label htmlFor="spec">
            Item description, specification or OEM part number
          </label>
          <textarea
            {...fieldProps("spec")}
            rows={4}
            value={values.spec}
            onChange={(e) => set("spec", e.target.value)}
            placeholder="e.g. VRF outdoor unit, 16 HP, R410A, 3-phase — or paste a BOQ line"
          />
          <FieldError id="spec-error" message={err("spec")} />
        </div>

        <div className="field">
          <span className="label" id="verticals-label">
            Verticals needed
          </span>
          <div
            role="group"
            aria-labelledby="verticals-label"
            aria-describedby={err("verticals") ? "verticals-error" : undefined}
            className="flex flex-wrap gap-2"
          >
            {verticals.map((v) => {
              const on = values.verticals.includes(v.slug);
              return (
                <button
                  key={v.slug}
                  type="button"
                  className="tag"
                  aria-pressed={on}
                  onClick={() => {
                    const next = on
                      ? values.verticals.filter((s) => s !== v.slug)
                      : [...values.verticals, v.slug];
                    setValues((cur) => ({ ...cur, verticals: next }));
                    setTouched((t) => ({ ...t, verticals: true }));
                    setErrors(validate({ ...values, verticals: next }));
                  }}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
          {err("verticals") ? (
            <p id="verticals-error" className="field-error">
              {err("verticals")}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="quantity">
            Quantity and any phasing across deliveries
          </label>
          <textarea
            {...fieldProps("quantity")}
            rows={2}
            value={values.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            placeholder="e.g. 24 units — 8 in week 1, 16 in week 4"
          />
          <FieldError id="quantity-error" message={err("quantity")} />
        </div>
      </fieldset>

      <fieldset className="m-0 mt-10 border-0 p-0">
        <legend className="kicker mb-6 text-accent-700">Delivery</legend>

        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-[1fr_180px]">
          <div className="field">
            <label htmlFor="location">Delivery location</label>
            <input
              {...fieldProps("location")}
              type="text"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              autoComplete="address-level2"
              placeholder="Site or warehouse address"
            />
            <FieldError id="location-error" message={err("location")} />
          </div>

          <div className="field">
            <label htmlFor="pin">PIN code</label>
            <input
              {...fieldProps("pin")}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={values.pin}
              onChange={(e) =>
                set("pin", e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              autoComplete="postal-code"
            />
            <FieldError id="pin-error" message={err("pin")} />
          </div>
        </div>

        <div className="field max-w-[280px]">
          <label htmlFor="requiredBy">Required-by date</label>
          <input
            {...fieldProps("requiredBy")}
            type="date"
            value={values.requiredBy}
            onChange={(e) => set("requiredBy", e.target.value)}
          />
          <FieldError id="requiredBy-error" message={err("requiredBy")} />
        </div>
      </fieldset>

      <fieldset className="m-0 mt-10 border-0 p-0">
        <legend className="kicker mb-6 text-accent-700">
          Billing and contact
        </legend>

        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="gstin">GSTIN</label>
            <input
              {...fieldProps("gstin")}
              type="text"
              maxLength={15}
              value={values.gstin}
              onChange={(e) => set("gstin", e.target.value.toUpperCase())}
            />
            <p className="field-hint">
              Optional here, required before the proforma is raised.
            </p>
            <FieldError id="gstin-error" message={err("gstin")} />
          </div>

          <div className="field">
            <label htmlFor="billingEntity">Billing entity</label>
            <input
              {...fieldProps("billingEntity")}
              type="text"
              value={values.billingEntity}
              onChange={(e) => set("billingEntity", e.target.value)}
            />
            <p className="field-hint">If different from the company name.</p>
          </div>

          <div className="field">
            <label htmlFor="companyName">Company name</label>
            <input
              {...fieldProps("companyName")}
              type="text"
              value={values.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              autoComplete="organization"
            />
            <FieldError id="companyName-error" message={err("companyName")} />
          </div>

          <div className="field">
            <label htmlFor="contactName">Contact name</label>
            <input
              {...fieldProps("contactName")}
              type="text"
              value={values.contactName}
              onChange={(e) => set("contactName", e.target.value)}
              autoComplete="name"
            />
            <FieldError id="contactName-error" message={err("contactName")} />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              {...fieldProps("email")}
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
            />
            <FieldError id="email-error" message={err("email")} />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              {...fieldProps("phone")}
              type="tel"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              autoComplete="tel"
              placeholder="+91"
            />
            <FieldError id="phone-error" message={err("phone")} />
          </div>
        </div>
      </fieldset>

      {status === "error" ? (
        <div
          role="alert"
          className="mt-4 border-2 border-accent-700 bg-accent-100 p-4"
        >
          <p className="m-0 text-[15px] font-semibold text-accent-700">
            The enquiry did not send. Nothing you entered has been lost — try
            again, or call{" "}
            {contact.phones.map((p, i) => (
              <span key={p}>
                {i > 0 ? " or " : ""}
                <a href={`tel:${p.replace(/\s/g, "")}`} className="text-accent-700">
                  {p}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary mt-6 min-w-[240px]"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send enquiry"}
        {status === "submitting" ? null : <ArrowRight size={16} aria-hidden />}
      </button>

      <p className="mt-4 mb-0 text-[13px] text-muted">
        We use these details only to prepare and follow up your quotation. See
        the{" "}
        <a href="/privacy" className="font-semibold text-accent-700 underline underline-offset-2">
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}
