# Deploying

Written to be followed start to finish by someone who has not seen this project
before. Roughly 90 minutes of work, most of it waiting for DNS.

Do these in order. Steps 1–4 are safe to do at any time — nothing is public
until step 5, when the domain is pointed at Vercel.

**Do not point the domain at Vercel until the enquiry form actually sends.**
A live credibility site with a dead form is worse than no site: a buyer sends a
specification, hears nothing, and concludes the 24-hour promise is decoration.
Step 4 is what makes the form real; step 5 is what makes the site public. That
order is not arbitrary.

---

## 0. What `proservindia.in` looks like today

Observed from public DNS, 5 September 2026. Re-check before you change anything
— this is a snapshot, not a guarantee.

| | |
| --- | --- |
| **DNS host** | **GoDaddy** — nameservers `ns13.domaincontrol.com` / `ns14.domaincontrol.com`. All record changes below happen in the GoDaddy DNS panel: *My Products → Domains → proservindia.in → DNS*. |
| **Apex `A`** | `3.33.130.190`, `15.197.148.33` — GoDaddy's parking/forwarding addresses. Nothing is really hosted there. These are what step 5 replaces. |
| **`www`** | `CNAME` → `proservindia.in`. |
| **Mail** | **Microsoft 365** — MX `proservindia-in.mail.protection.outlook.com`. |
| **Root SPF** | `v=spf1 include:spf.protection.outlook.com include:sender.zoho-books.in include:spf-eu.emailsignatures365.com -all` — Microsoft 365, Zoho Books and Exclaimer. Uses 4 of the 10 permitted DNS lookups, so there is headroom. |
| **DMARC** | None published. |

Three consequences worth reading before you touch anything:

1. **Do not add Resend to the root SPF record.** Resend authenticates against
   `send.proservindia.in`, which is a separate record. Editing the root SPF
   risks your Microsoft 365, Zoho Books and Exclaimer mail for no benefit.
2. **Do not delete or edit the MX record** during the domain cutover. It carries
   all mail to `Sales@` and `Ajaypal@`. Only the apex `A` records and the `www`
   `CNAME` change.
3. **`privacy@proservindia.in` is a Microsoft 365 job**, not a DNS one. In the
   M365 admin centre it can be a **shared mailbox** — no licence, no extra cost —
   or an alias on an existing mailbox. Shared is better: more than one person can
   watch it, and it survives someone leaving.

## 1. Push to GitHub

The repository is already initialised with one commit. It needs a remote.

```bash
cd "~/Desktop/Proserv/proserv Website/proserv-web"
git remote add origin git@github.com:<your-account>/proserv-web.git
git push -u origin main
```

Create the repo on GitHub first (private is fine — Vercel can read private
repos once you authorise it). If you use HTTPS rather than SSH, the remote URL
is `https://github.com/<your-account>/proserv-web.git`.

**Why bother with GitHub at all.** You could skip it and run `npx vercel --prod`
from this folder. But with the repo connected, every push deploys automatically
and every pull request gets its own preview URL you can send to someone before
it goes live. For a site that will be edited occasionally over years, that is
worth the ten minutes.

Confirm `node_modules` did not go up:

```bash
git ls-files | wc -l      # should be about 45, not thousands
git ls-files | grep -c env # should be 1 — .env.example only
```

## 2. Import to Vercel

1. vercel.com → **Add New** → **Project** → import the GitHub repo.
2. Framework preset: **Next.js**. Everything else stays default — no build
   command override, no output directory override, no root directory change.
3. Do **not** deploy yet. Add the environment variables first (step 3), or the
   first deploy will build without them and you will have to redeploy anyway.

The project builds in about a minute. Vercel gives it a `*.vercel.app` URL
immediately — use that for testing through steps 3 and 4.

## 3. Environment variables

Vercel → **Settings** → **Environment Variables**. Set each for **Production**,
**Preview** and **Development** unless noted.

| Name | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://proservindia.in` | Production only. Leave Preview unset so preview builds do not claim the canonical URL in their metadata and sitemap. |
| `RESEND_API_KEY` | from step 4 | |
| `ENQUIRY_TO` | `Sales@proservindia.in` | Comma-separated for several recipients. |
| `ENQUIRY_FROM` | `Proserv <enquiries@proservindia.in>` | Must be on the domain verified in step 4. |
| `ENQUIRY_AUTORESPONDER` | `on` | Set to `off` to stop the buyer confirmation without a code change. |

Environment variables only take effect on a **new deployment**. After adding
them, redeploy from the Deployments tab.

## 4. Resend — make the form actually send

Until this is done the form validates, shows the buyer a success state, and
delivers nothing. In production the function log records an explicit error
saying the enquiry was not delivered.

1. **Create the account** at resend.com. The free tier covers this volume.
2. **Domains → Add Domain → `proservindia.in`.**
3. **Read the Records tab and copy exactly what it shows.** Resend generates the
   values per domain — do not use records from a blog post or from another
   project. You will get three:
   - an **MX** record on `send.proservindia.in` — the return path
   - a **TXT** (SPF) record on `send.proservindia.in`
   - a **TXT** (DKIM) record on `resend._domainkey.proservindia.in`
4. **Add them in the GoDaddy DNS panel.** They sit on `send.` and
   `resend._domainkey.` subdomains, not on the root, so your Microsoft 365 mail
   is unaffected. **Add records; do not edit the existing root SPF or the MX.**
   Adding Resend to the root SPF is the classic mistake here and it buys you
   nothing — Resend authenticates against `send.proservindia.in`.
5. **Verify.** Usually minutes; allow up to an hour.
6. **API Keys → Create.** Sending permission only — the site never reads.
7. Put the key in `RESEND_API_KEY` (step 3) and redeploy.
8. **Send a real enquiry through the `*.vercel.app` form.** Confirm the desk
   email arrives at `ENQUIRY_TO` and the confirmation arrives at the address you
   used. Check the reply button on the desk email addresses the buyer.

**Do not launch on `onboarding@resend.dev`.** It works for testing but is
rate-limited and lands in spam, which is precisely backwards for this site.

**Add a DMARC record once Resend verifies.** `proservindia.in` has none today,
which is a gap worth closing regardless of this site — your root SPF already ends
in `-all`, so you are half way there. Start in monitor mode, which changes
nothing about delivery and only collects reports:

```
Type   TXT
Name   _dmarc
Value  v=DMARC1; p=none; rua=mailto:dmarc@proservindia.in
```

Read the reports for a few weeks to confirm nothing legitimate is failing, then
tighten `p=none` to `p=quarantine`. It protects the domain from being spoofed and
improves the odds a first-contact email reaches a procurement inbox rather than
its junk folder — which matters more for you than for most senders, because a
cold quotation to a buyer who has never heard of you is exactly the mail that
gets filtered.

## 5. Point the domain

Only after step 4 passes.

The apex currently points at GoDaddy's parking addresses (see step 0). Note the
existing values before you overwrite them, in case you need to put them back.

1. Vercel → **Settings** → **Domains** → **Add** → `proservindia.in`. Vercel
   will prompt you to add `www.proservindia.in` as well. Do.
2. **Use the exact records shown on the domain card.** Vercel's apex A record is
   `76.76.21.21` in most cases, but the `www` CNAME target is now
   **project-specific** — something like `d1d4fc829fe7bc7c.vercel-dns-017.com`,
   not the generic `cname.vercel-dns.com` you will find in older guides. Copy
   what your dashboard shows.
3. In the GoDaddy DNS panel:
   - **Replace** the two apex `A` records (`3.33.130.190`, `15.197.148.33`) with
     Vercel's single `A` value.
   - **Repoint** the `www` `CNAME` from `proservindia.in` to Vercel's
     project-specific target.
   - **Change nothing else.** In particular leave the `MX` record and the root
     `TXT` SPF record exactly as they are. Deleting the MX stops mail to
     `Sales@` and `Ajaypal@` the moment it propagates.
   - If GoDaddy has domain **forwarding** switched on for this domain, turn it
     off. Forwarding overrides the A record and will keep the site unreachable
     no matter how correct your DNS looks.
4. Wait for propagation. Usually minutes, occasionally hours. Vercel's domain
   card turns green and issues the TLS certificate on its own.
5. In **Domains**, set the redirect so one of the two is canonical — apex to
   `www` or the reverse. Either is fine; having both serve the same content
   without a redirect is not. Whichever you pick must match
   `NEXT_PUBLIC_SITE_URL` from step 3, or the canonical tags and the sitemap
   will disagree with the address people actually land on.

**Do not use the Vercel nameserver option.** Vercel offers taking over the
domain's nameservers entirely. That would move your `MX`, SPF and every other
record out of GoDaddy and into Vercel's DNS — a much larger and riskier change
than this site needs, and it puts your company email in the hands of your web
host.

## 6. Before you call it live

- [ ] Enquiry form sends; both emails arrive; reply-to on the desk email goes to
      the buyer
- [ ] `privacy@proservindia.in` exists as a Microsoft 365 shared mailbox and
      someone reads it — the address is published on `/privacy`
- [ ] `/privacy` read by whoever handles your contracts (see `NOTES.md` item 3)
- [x] The document list on `/what-you-receive` matches what Proserv actually
      issues — confirmed 5 September 2026 (`NOTES.md` item 5)
- [ ] Vertical 08's solar lines reconciled with the company profile PDF
      (`NOTES.md` item 4) — the two documents currently disagree
- [ ] `https://proservindia.in/sitemap.xml` returns 14 URLs with the right
      origin
- [ ] `https://proservindia.in/robots.txt` points at that sitemap
- [ ] Someone other than you sends a test enquiry from a phone
- [ ] MX record unchanged — send yourself a mail at `Sales@proservindia.in`
      after the cutover and confirm it arrives

## 7. After launch

- **Search Console.** Add the property, submit the sitemap. This is a new domain
  with no history; expect weeks before it ranks for anything.
- **Watch the function logs** for the first fortnight. Vercel → the project →
  Logs, filtered to `/api/enquiry`. Anything logged as
  `[enquiry] internal send failed` is a lost enquiry and needs looking at the
  same day.
- **Spam.** The form has a honeypot, a five-per-hour-per-IP limit and
  server-side validation. If junk still arrives, add Cloudflare Turnstile — it
  is the least intrusive challenge for a B2B audience.
- **Deleting old enquiries.** `/privacy` publishes a 24-month retention period
  for enquiries that do not become orders. That is now a commitment; put a
  recurring reminder somewhere.

## Making a change later

```bash
git add -A
git commit -m "what changed"
git push
```

Vercel builds and deploys on push. Content edits are usually one line in
`content/*.ts` — see README → *Editing content*. Run `npx tsc --noEmit` and
`npx eslint .` before pushing; both should be clean.

Roll back a bad deploy from Vercel → Deployments → the previous one →
**Promote to Production**. It is instant and does not need a git revert.
