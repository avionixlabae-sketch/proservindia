# Proserv Property Services — marketing website

Credibility site for a Procurement-as-a-Service company in Gurugram. The visitor
is a procurement manager, project purchaser or facilities head deciding whether
Proserv can be trusted with a multi-category purchase order. One conversion
action: **Request a quotation**, answered in 24 hours.

No catalogue, no part-number search, no stock levels, no pricing, no cart, no
login. Capability and governance are the content.

**`DEPLOY.md`** is the runbook for getting this live. **`NOTES.md`** lists every
assumption, every `TODO:` and what still needs a decision before launch — read
it first.

---

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
npx tsc --noEmit       # types
npx eslint .           # lint
```

Node 20+. Nothing is required to run — copy `.env.example` to `.env.local` when
you want the enquiry form to actually send.

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, JSON-LD, sitemap and robots. Defaults to `https://proservindia.in`. **Set this on Vercel.** |
| `RESEND_API_KEY` | Absent → the form logs instead of sending. Present → it sends. |
| `ENQUIRY_TO` | Where enquiries land. Comma-separated for several. Defaults to `Sales@proservindia.in`. |
| `ENQUIRY_FROM` | Sender. Must be on a domain verified in Resend. |
| `ENQUIRY_AUTORESPONDER` | `off` disables the buyer confirmation. Anything else leaves it on. |

## Enquiry email

An enquiry sends two messages:

- **To the desk** — every field, laid out to be triaged from the inbox list.
  Subject carries the company and the verticals; `Reply-To` is the buyer, so
  replying answers them directly rather than the sender address.
- **To the buyer** — an autoresponder restating the 24-hour commitment in the
  same words as the on-page success state, echoing what was received so a wrong
  PIN code or date gets corrected before quoting, and giving both phone numbers
  as the faster path.

The two are not equal. The desk email is the enquiry; if it fails the route
returns 502 and the form shows the error with the phone numbers rather than a
false success. The autoresponder is a courtesy; if it fails the enquiry is still
received, so the failure is logged and swallowed.

Both send through `lib/mail.ts`, a small transport interface with one Resend
implementation. Swapping in SES, Postmark or a CRM webhook is a change to that
file alone — the route never touches a vendor SDK. Sends retry once, because a
transient 5xx is common enough on any mail API to be worth 400ms.

**Setting up Resend** (about 20 minutes, most of it DNS propagation):

1. Create an account at resend.com.
2. Domains → Add Domain → `proservindia.in`. Resend gives you three DNS records
   — a DKIM `TXT`, an SPF `TXT` and a `MX` for return-path. Add them wherever
   `proservindia.in` DNS is managed, then click Verify.
3. API Keys → Create, with sending permission only.
4. In Vercel → Settings → Environment Variables, set `RESEND_API_KEY`,
   `ENQUIRY_TO` and `ENQUIRY_FROM`. Redeploy.
5. Send one enquiry through the live form and confirm both emails arrive.

Do not launch on `onboarding@resend.dev`. It works for testing but is
rate-limited and lands in spam, which is the opposite of what this site is for.

## Deploying

**See `DEPLOY.md`** — the full runbook: GitHub, Vercel, Resend DNS, the domain
cutover from the current registrar parking record, and a pre-launch checklist.

Short version: Vercel, framework preset Next.js, no build overrides, set the
environment variables above. Do not point the domain at it until the enquiry
form actually sends.

**There is no static export, deliberately.** The original brief asked for
`output: "export"` *and* a `POST /api/enquiry` route; those are mutually
exclusive — static export strips route handlers and the form would 404 on
submit. Every page is prerendered at build time anyway, so the performance is
identical; only the enquiry route runs as a function. The reasoning is repeated
in `next.config.ts`. If a fully static build is ever needed, move the form to a
third-party endpoint first.

## Verified

Measured against the production build (`next build && next start`):

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `eslint .` | clean (no rules disabled, no suppressions) |
| Lighthouse desktop — `/`, `/verticals`, `/contact`, `/what-you-receive` | 100 performance · 100 accessibility · 100 best practices · 100 SEO |
| axe-core (WCAG 2.1 A + AA) — all 7 page types | 0 violations |
| Horizontal overflow at 360 / 768 / 1440 | none |
| Mobile nav — open, scroll lock, Escape, focus trap | pass |
| Sector filter — click, arrow keys, URL sync, deep link, invalid value | pass |
| Enquiry form — prefill, inline validation, GSTIN/phone/PIN rules, success state | pass |
| Enquiry API — honeypot drop, 422 on invalid, 429 rate limit | pass |
| Enquiry email — both messages, recipients, reply-to, content, HTML escaping | pass (23 assertions, against a mock Resend) |
| Enquiry email — desk send fails → 502, no false success | pass |
| Enquiry email — autoresponder fails → enquiry still succeeds | pass |
| Enquiry email — unconfigured → logs, sends nothing, warns in production | pass |
| Unknown vertical slug | 404 |

Re-run the Lighthouse and axe checks after any change to `globals.css` — the
contrast ratios there are tuned to the AA boundary, not comfortably above it.

---

## Structure

```
app/
  layout.tsx              chrome, fonts, Organization JSON-LD
  page.tsx                Home
  verticals/page.tsx      overview + sector filter
  verticals/[slug]/       eight detail routes, generated from content
  what-you-receive/       the document trail  (replaces "Capabilities")
  about/                  mission, quality management, statutory table
  contact/                enquiry form + contact panel + vendor pack
  privacy/                DPDP Act notice
  api/enquiry/route.ts    validate → rate limit → send (needs RESEND_API_KEY)
  opengraph-image.tsx     type-only social card
  sitemap.ts, robots.ts, not-found.tsx
  fonts/                  Archivo woff2, self-hosted
components/
  primitives.tsx          Container, Section, Kicker, SectionHead
  blocks.tsx              grids, process row, stat band, closing banner
  Header / Footer / UtilityBar
  SpecBlock               hero enquiry shortcut  (client)
  SectorFilter            verticals filter       (client)
  EnquiryForm             the form               (client)
content/
  company.ts   verticals.ts   sectors.ts   process.ts   documents.ts
lib/
  site.tsx            nav, JSON-LD builders, SITE_URL
  validation.ts       form rules, shared by client and server
  mail.ts             transport interface + Resend implementation
  enquiry-emails.ts   the desk email and the buyer autoresponder
```

Only four components are client components — the mobile nav, the sector filter,
the hero spec block and the enquiry form. Everything else is a server component.

## Editing content

Pages map over `content/*.ts`. Markup is never duplicated per vertical, so a
content change is a one-line edit.

**Add or change a vertical** — edit `content/verticals.ts`. A new entry needs:

```ts
{
  no: "09",                       // rendered as the display numeral
  slug: "cable-management",       // becomes /verticals/cable-management
  name: "Cable Management",
  kicker: "The profile's own subtitle",
  positioning: "One sentence for the detail page hero.",
  items: ["…"],                   // full list; Home shows the first three
  sectors: ["ecommerce-warehousing"],   // slugs from content/sectors.ts
  supplyModels: ["indent"],             // "stock-backed" | "indent"
  regulatory: [0, 5],                   // indices into process.ts regulatoryNotes
}
```

That is the whole change. The route, the Home grid cell, the footer link, the
sitemap entry, the filter and the form's vertical toggles all follow. If the
count stops being eight, update the copy that says "eight" — Home's kicker,
the hero headline and the About page all name the number.

**Change a statutory ID** — `content/company.ts`. The CIN is a single exported
constant (`CIN`) because it appears in the footer, the compliance strip, the
About table, the OG image and the JSON-LD.

**Add real case studies** — populate `caseStudies` in `content/documents.ts`.
They render above the document trail on `/what-you-receive` with no code change.

## Design system

Ported from the Modernist system in the handoff bundle, with the accent retuned
to the brand palette sampled from the logo. `app/globals.css` is the only place
a colour is declared; components reference tokens or the Tailwind utilities
generated from them in `@theme`.

The two contrast decisions that are **not** stylistic preferences:

- `.btn-primary` fills with `--color-accent-700` (`#006200`), not the brand green
  `#009800`. A 14px light label on the brand green is 3.42:1 and fails AA; on
  `#006200` it is 6.9:1.
- The closing banner runs **purple** (`#580098`, 10.06:1), not green. On green,
  only display-scale type would pass.

The CSS is layered — `@layer base` for element defaults, `@layer components` for
the class-based components — so Tailwind utilities always win over component
classes. Without that layering `.btn` beats `.hidden` on source order and the
header's desktop CTA leaks onto mobile.

Rules between grid cells are drawn by a 2px grid `gap` over a divider-coloured
container (`.ruled`), not by per-cell borders with `nth-child` maths. This stays
correct through every collapse — 4 → 2 → 1 — with no dangling rule on a stacked
column and no empty ruled cell at intermediate widths.

**Zero corner radius anywhere**, enforced with `* { border-radius: 0 !important }`
in the base layer. Everything is flush left, including labels inside buttons.

## Imagery

There is none, by instruction. No stock photography, no faces, no warehouse or
handshake imagery, no AI illustration. The only raster asset in the build is the
client's logo. Visual interest is display numerals, the visible modular grid,
typographic section markers and tables. The OG image is type only.

If a slot later needs a photograph, use a flat token-coloured block with a
monospace caption naming what belongs there. Do not fill it with something else.

## Fonts

Archivo 400/600/800, self-hosted from `app/fonts/` via `next/font/local`.

`next/font/google` would also self-host, but it fetches from Google at **build**
time, making every deploy depend on Google being reachable from the build
machine. The woff2 files are committed instead (latin subset, from the Fontsource
distribution of the same SIL Open Font License release), so the build is hermetic
and no request leaves the visitor's browser for a third party.

To add a weight: drop the woff2 in `app/fonts/` and add it to the `src` array in
`app/layout.tsx`.
