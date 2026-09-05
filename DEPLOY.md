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
4. **Add them wherever `proservindia.in` DNS lives.** Note that these sit on
   `send.` and `resend._domainkey.` subdomains, not on the root — so your
   existing mailboxes on `proservindia.in` should be unaffected. Check the
   dashboard's values against your current records before pasting anything, and
   in particular do not replace an existing root SPF record.
5. **Verify.** Usually minutes; allow up to an hour.
6. **API Keys → Create.** Sending permission only — the site never reads.
7. Put the key in `RESEND_API_KEY` (step 3) and redeploy.
8. **Send a real enquiry through the `*.vercel.app` form.** Confirm the desk
   email arrives at `ENQUIRY_TO` and the confirmation arrives at the address you
   used. Check the reply button on the desk email addresses the buyer.

**Do not launch on `onboarding@resend.dev`.** It works for testing but is
rate-limited and lands in spam, which is precisely backwards for this site.

Once verified, consider adding a **DMARC** record if `proservindia.in` does not
have one. It is not required to send, but it protects the domain from spoofing
and improves the odds a first-contact email reaches a procurement inbox rather
than its junk folder.

## 5. Point the domain

Only after step 4 passes.

`proservindia.in` currently resolves to registrar-parking addresses, so
something is holding the record — find it at the registrar before changing
anything, and note what it is in case you need to put it back.

1. Vercel → **Settings** → **Domains** → **Add** → `proservindia.in`. Vercel
   will prompt you to add `www.proservindia.in` as well. Do.
2. **Use the exact records shown on the domain card.** Vercel's apex A record is
   `76.76.21.21` in most cases, but the `www` CNAME target is now
   **project-specific** — something like `d1d4fc829fe7bc7c.vercel-dns-017.com`,
   not the generic `cname.vercel-dns.com` you will find in older guides. Copy
   what your dashboard shows.
3. At the registrar: replace the parking A record on the apex with Vercel's,
   and add the `www` CNAME. Leave every **MX** record alone — those carry your
   email, and deleting them stops mail to `Sales@` and `Ajaypal@` immediately.
4. Wait for propagation. Usually minutes, occasionally hours. Vercel's domain
   card turns green and issues the TLS certificate on its own.
5. In **Domains**, set the redirect so one of the two is canonical — apex to
   `www` or the reverse. Either is fine; having both serve the same content
   without a redirect is not.

**The nameserver alternative.** Vercel also offers taking over the domain's
nameservers entirely. Do not do that here. It would move MX, and therefore
company email, into Vercel's DNS, which is a much larger change than this site
needs.

## 6. Before you call it live

- [ ] Enquiry form sends; both emails arrive; reply-to on the desk email goes to
      the buyer
- [ ] `privacy@proservindia.in` exists and someone reads it — the address is
      published on `/privacy`
- [ ] `/privacy` read by whoever handles your contracts (see `NOTES.md` item 3)
- [ ] The document list on `/what-you-receive` matches what Proserv actually
      issues (`NOTES.md` item 5) — that page's whole value is that every line is
      checkable
- [ ] Vertical 08's solar lines reconciled with the company profile PDF
      (`NOTES.md` item 4) — the two documents currently disagree
- [ ] `https://proservindia.in/sitemap.xml` returns 14 URLs with the right
      origin
- [ ] `https://proservindia.in/robots.txt` points at that sitemap
- [ ] Someone other than you sends a test enquiry from a phone

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
