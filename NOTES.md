# Notes — assumptions, TODOs and open questions

Everything the build assumed, changed, or could not resolve.

---

## Resolved

### 1. CIN — verified, no change needed ✓

**Closed 5 September 2026.** `U70109HR2022PTC104279`, as printed in the 2026
profile, is correct and stays.

Raised because third-party MCA-derived registries also return
`U46909HR2022PTC104279` against the same registration number (`PTC104279`) —
a different NIC activity code, 46909 "non-specialised wholesale trade" instead
of 70109 "real estate activities on a fee or contract basis". That is stale
aggregator data. Recorded here so the same discrepancy does not get re-raised
next time someone runs a due-diligence search.

---

## Blocking

### 2. The enquiry form needs a Resend key — the code is done

**Built and tested.** An enquiry now sends a desk email (every field, `Reply-To`
set to the buyer) and a buyer autoresponder (24-hour commitment, echo of what
was received, both phone numbers). Failure handling is asymmetric on purpose: if
the desk email fails the route returns 502 and the form shows the phone numbers
rather than a false success; if only the autoresponder fails, the enquiry still
succeeds. Verified against a mock Resend — 23 assertions covering recipients,
reply-to, content, HTML escaping, both failure modes and the unconfigured
fallback.

**What is left is not code.** Until `RESEND_API_KEY` is set the route logs
instead of sending, and in production it logs an explicit error saying the
enquiry was not delivered.

**Action.** Create the Resend account, verify `proservindia.in` (three DNS
records), and set `RESEND_API_KEY`, `ENQUIRY_TO` and `ENQUIRY_FROM` in Vercel.
Full steps in README → Enquiry email. Then send one enquiry through the live
form and confirm both emails arrive.

Two things to decide while doing it:

- **Who receives.** `ENQUIRY_TO` takes a comma-separated list. Sales alone, or
  Sales and Ajaypal both?
- **Read the autoresponder copy** (`lib/enquiry-emails.ts`). It is the first
  thing a buyer ever receives from Proserv and it makes a promise on the
  company's behalf. It should sound like you.

Do not launch on `onboarding@resend.dev` — it is rate-limited and lands in spam.

If a CRM is added later, `lib/mail.ts` is a transport interface with one
implementation; the route never imports a vendor SDK, so a second destination is
a change to that file alone.

### 3. The privacy notice is complete but unreviewed, and needs a mailbox

The original handoff filed privacy and terms as "non-blocking, decide before
launch". Under India's **Digital Personal Data Protection Act, 2023** a notice is
required at the point personal data is collected, and the form collects name,
email, phone, GSTIN and billing entity — so the form should not be live without
one. `/privacy` was written from what the site actually does rather than from a
template.

**All three blanks are now filled** (5 September 2026):

- **Retention** — enquiries that do not result in an order are deleted 24 months
  after last contact. Order records follow tax, warranty and ISO 9001:2015
  traceability obligations. *This is now a published commitment: someone has to
  actually delete them.* A calendar reminder or a quarterly purge of the sales
  inbox is enough at this volume, but the promise is only worth the practice.
- **Data contact** — `privacy@proservindia.in`, published as a role rather than
  a named individual so the notice does not go stale when responsibility moves.
  DPDP requires contact details of a person able to respond, which a monitored
  functional address with a stated role satisfies. A 30-day response window is
  published.
- **Processors** — Vercel (hosting) and Resend (email) are named. If a CRM or a
  second mail provider is added, it belongs in section 03 by name before it goes
  live.

**Two actions remain:**

1. **Create `privacy@proservindia.in`** and route it to a real person. The
   address is published on a live page; an address that bounces is worse than
   the sales inbox would have been. Set it in `contact.privacyEmail` in
   `content/company.ts` if you use a different one.
2. **Have counsel read the page.** It is not legal copy — the structure and
   disclosures follow what the Act asks for, but no lawyer has seen it. It is a
   20-minute read for anyone who handles your contracts.

Terms of use were not written. Whether they are needed depends on your view —
nothing is sold through the site.

---

## Changed from the original handoff

### 4. Vertical 08 was extended beyond the profile

**As given**, "Renewable Energy — solar parks and balance of system" listed five
items: HT/LT power cables, data and control cables, HDPE conduit, PPE and site
signage, hand and power tools. None of them is generation equipment. A solar EPC
buyer — the second of the eight named sectors — would land on the page named for
their sector and find nothing they recognise as a solar purchase.

**Now**, five lines were added ahead of the profile's five, confirmed by the
client as categories Proserv supplies:

- Monocrystalline PV modules, TOPCon and bifacial
- String and central inverters
- Module mounting structures, fixed-tilt and tracker
- DC cable, MC4 connectors and string combiner boxes
- Earthing, lightning protection and site SCADA

**These five are not in the 2026 profile PDF.** The site and the profile now
disagree, and a buyer reading both will notice. Fold them into the next profile
revision, or delete them from `content/verticals.ts` — the comment marking them
is on the entry itself.

Worth deciding separately: whether the trailing balance-of-system lines (PPE,
hand tools, signage) belong under "Renewable Energy" at all, or whether they are
really a ninth category — general site supply — that several sectors buy.

### 5. "Capabilities in practice" became "What you receive"

The handoff specified a `/capabilities` page of illustrative supply scenarios by
sector, because the profile contains no case studies and fabricating them was
correctly ruled out.

The problem with the fallback: a page telling a procurement manager what a
warehouse operator *typically* consolidates reads as an absence of projects, in
the one place on the site that promises evidence. It spends the reader's
attention and returns nothing they can verify.

`/what-you-receive` documents the paperwork issued against an order instead —
quotation, proforma, order acknowledgement, goods-inward inspection record,
batch and serial traceability, BIS/BEE declarations, non-conformance report, GST
invoice, e-way bill, packing list, delivery challan, OEM warranty letter,
complaint log. All of it is derived from the profile's own quality-management and
regulatory commitments; none of it is claimed history. It is also the thing a
governed vendor can produce and an ungoverned one cannot, which is the argument
the page needs to make.

**Confirm the document list against what Proserv actually issues** before launch
(`content/documents.ts` → `documentTrail`). Anything not genuinely produced today
must come out — the page's whole value is that every line is checkable.

Real case studies drop into `caseStudies` in the same file and render above the
trail with no rebuild. Sector, multi-vertical scope and outcome are enough; no
client names needed.

### 6. Added: the vendor registration pack

Not in the handoff. In Indian B2B procurement it is the first thing a buyer's
finance team asks for, and being slow with it is a common reason a supplier
loses a first order to an incumbent. It appears twice — a block on
`/what-you-receive` and a panel on `/contact#vendor-pack`.

Right now it is an **email fallback**, not a download (`vendorPack.href` is
`null` in `content/documents.ts`).

**Action.** Assemble one PDF bundle — certificate of incorporation and PAN, GST
certificate, UDYAM certificate, ISO 9001:2015 certificate, IEC, LEI, bank details
and a cancelled cheque — put it at `/public/vendor-pack.pdf`, and set `href`.
Decide whether it downloads directly or is email-gated; direct is faster to
onboard, gated captures the lead.

### 7. Dropped: static export

`output: "export"` and `POST /api/enquiry` cannot coexist — static export strips
route handlers. The handoff asked for both. Resolution and reasoning are in
`next.config.ts` and the README. Every page is still prerendered; only the
enquiry route runs as a function.

### 8. Added: spam controls

Not in the handoff, and a public form on a small B2B site fills with bot
submissions within weeks. Three layers, all in the API route and the form:

- a honeypot field (`website`) — filled means bot, dropped with a 200 so the bot
  learns nothing;
- a per-IP rate limit, 5 per hour;
- server-side re-validation using the same rules as the client.

The rate limit is in-memory, which is adequate for a single-region Vercel
deployment at this volume. If it ever needs to survive scale-out, move it to
Upstash or Vercel KV. If spam still gets through, add Cloudflare Turnstile —
it is the least intrusive challenge for a B2B audience.

### 9. Fonts are committed, not fetched at build

`next/font/local` with woff2 files in `app/fonts/`, rather than
`next/font/google`. Reasoning in the README. Same typeface, same licence, one
fewer build-time dependency.

---

## Carried over from the handoff, still open

### 10. The logo says "REAL ESTATE · SIMPLIFIED" — now explained, not contradicted

**Decision taken: ship the logo exactly as supplied.**

This was originally logged as a contradiction: "REAL ESTATE · SIMPLIFIED" in the
header, directly above "Eight equipment verticals. One purchase order.", with a
legal name of *Property Services* and a real-estate NIC class on the CIN. That
reading was wrong, and the correction matters.

Proserv did not pivot away from property services. It extended into procurement
**to cover the complete aspect of commercial real estate services** — a fit-out
runs eight vendor relationships for one building, so the client gets one instead,
covering both the CAPEX that goes in at handover and the OPEX that follows for as
long as the site runs.

Read that way nothing on the site is in tension. The name is the origin, the
tagline is the through-line, and the CIN's activity class is consistent rather
than stale. What was missing was only that no page said so.

**Fixed**: `/about` now opens with a *Where we started* section
(`content/company.ts` → `origin`) followed by a CAPEX / OPEX block (→
`spendTypes`) showing both sides of a client's spend under one agreement. The
spend examples are drawn from the standing categories in `verticals.ts` —
nothing new is claimed.

Two things worth considering, neither blocking:

- **The CAPEX / OPEX frame may deserve more than one page.** Everything else on
  the site is organised by product vertical, which is how Proserv sources. CAPEX
  and OPEX is how the buyer's budget is approved — different budget line,
  different approval path, often a different person. A facilities head thinking
  "what can I put on OPEX this quarter" currently has no entry point.
- **Home does not carry the origin at all.** Deliberate, to keep the hero to one
  argument. If buyers keep asking why a property company sells equipment, a
  single line on Home is the cheapest answer.

Still needed regardless: an **SVG** of the mark, and a **reversed/knockout**
version for the purple banner and any dark surface. The build uses the supplied
raster PNG in the header and footer.

### 11. No client logos, no testimonials, no certificate artefact

None exist in the profile, so none are on the site. Two would materially
strengthen it once available:

- a downloadable PDF of the **ISO 9001:2015 certificate** (no. 3029QAF25) on
  `/about` — a claimed certification a buyer can open is worth more than one they
  cannot;
- permissioned **client marks**, if any client will allow it. No logo wall until
  real, permissioned marks exist.

### 12. Domain

`proservindia.in` resolves, but to registrar-parking addresses — no site was
reachable from the build environment. Confirm whether the new site replaces
something at that domain, whether redirects from old URLs are needed, and set
`NEXT_PUBLIC_SITE_URL` on Vercel to the final origin. Until it is set, metadata,
JSON-LD, sitemap and robots all default to `https://proservindia.in`.

### 13. Analytics, map embed

Neither was specified, so neither was added. A Google Maps embed on `/contact`
would be the only third-party imagery on the site and needs an explicit yes.
Any analytics script needs a decision and a line in the privacy notice.

---

## Smaller assumptions

- **"Services" is expressed as verticals**, using the profile's own eight-category
  structure and its own subtitles.
- **Audience is commercial and institutional only.** No residential framing
  anywhere, despite the company name.
- **Sector-to-vertical mappings** (`verticals.ts` → `sectors`) drive the filter
  and the "who buys it" tags. They are a reasonable reading of the profile, not
  stated in it. Worth a client pass — they decide what a filtered visitor sees.
- **Per-vertical regulatory notes** (`verticals.ts` → `regulatory`) select which
  of the profile's six compliance lines appear on each detail page. Same caveat.
- **Vertical positioning lines** and the **process step descriptions** were
  written for this build, in the profile's register, from what the profile
  states. They are the only substantial prose on the site not traceable to a
  profile line.
- **The dark-mode toggle and part-number inventory search** in the reference
  build were dropped — both conflict with the mono system and with a
  credibility-rather-than-transactional brief. The hero's "send a specification"
  block replaces the search: it is an enquiry shortcut, not a lookup, and no
  catalogue sits behind it.
- **`/what-you-receive` is in the main nav** in place of Capabilities. Four nav
  items: Verticals, What you receive, About, Contact.
- **Stats are the profile's** — 8 verticals, 50+ supplier and OEM ties, 10+
  states, 24-hour turnaround, incorporated 2022. Unverifiable from outside; if
  any has moved since the profile was written, update `headlineStats`.
