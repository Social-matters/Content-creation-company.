# Content Creation Company — marketing site (Phase 1)

The public site for **Content Creation Company (CCC)**, an influencer-marketing company with creator content to match. Next.js 16 · TypeScript · Tailwind v4 · GSAP (ScrollTrigger, SplitText) · Lenis · motion.

Phase 1 of 3: marketing site (this repo) → Phase 2 brand/creator dashboards → Phase 3 mobile app.

## Setup

Requirements: Node 20+ (24 tested), pnpm 10+, ffmpeg (only for `pnpm assets`).

```bash
pnpm install
cp .env.example .env.local     # form email settings (see "Form emails"); without a key, dev only logs submissions
pnpm dev                       # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` / `build` / `start` | Next.js dev server / production build / serve the build |
| `pnpm lint` · `pnpm typecheck` | ESLint · route typegen + `tsc --noEmit` |
| `pnpm shots [route…] [--w=1440,768,390] [--entrance] [--reduced]` | Scrolls routes in Playwright, saves screenshots to `shots/`, prints console errors |
| `pnpm smoke` | Interaction test: entrance, modal, validation, lead submit, Esc, route wipe, "Join the network" and "Contact for pricing" links, old-address redirects, a crawl of every internal link and anchor, skip link, mobile menu, reduced motion. Skips the submit if `.env.local` has a key (`SMOKE_SEND=1` sends it) |
| `pnpm test:forms` | Builds, then submits every form against a mock Resend server and checks each email. Never sends real mail |
| `pnpm logos [dir]` | Processes client logos from `.incoming/client-logos/` into `public/brand/clients/` + `src/content/clients.ts` |
| `pnpm assets [slot] [--force]` | Downloads + compresses media into `public/media/` (ffmpeg) |
| `pnpm assets:doc` | Regenerates `ASSETS.md` from the asset sources |
| `pnpm check:content` | Fails while placeholder content remains (use in CI before production) |

`pnpm shots` / `pnpm smoke` need a running server (`BASE_URL`, default `http://localhost:3000`) and Playwright's
Chromium (`npx playwright install chromium`). On Git Bash for Windows prefix route args with `MSYS_NO_PATHCONV=1`.

> `pnpm start` is a production server: it needs a Google Sheet or email destination (see "Where form submissions
> go"), or server requests fail with a configuration error.

> **Dev-server quirk:** if a page shows a hydration mismatch right after you edited a client component,
> restart `pnpm dev` (stale server bundle). Production builds are unaffected.

## Structure

```
src/
  app/
    layout.tsx               fonts, metadata, JSON-LD, entrance pre-paint script
    (marketing)/             every public route (shares MarketingShell)
      page.tsx               home
      celebrities/ model-shoots/ about/ contact/ privacy/ terms/
      styleguide/            hidden design-system page (noindex)
    (brand)/ (creator)/      reserved for Phase 2 (README only)
    actions.ts               server action: validate + hand lead to the adapter
    not-found.tsx · opengraph-image.tsx · robots.ts · sitemap.ts · icon.png
  components/
    providers/               SmoothScroll (Lenis⇄GSAP), UIProvider (modals, entrance), PageTransition (orange wipe)
    layout/                  MarketingShell, Nav, MobileMenu, Footer, Preloader, LazyChrome
    sections/                sections shared by inner pages (grids, enquiry form, contact tabs, legal)
    v2/                      home sections, inner-page hero, motion helpers (flow.tsx)
    forms/                   LeadForms (brand, network, contact, early access), fields, success state, ModalHost
    ui/                      Button, Badge, Headline (SplitText + tilted block), Counter, Marquee,
                             Video, PhoneFrame, Modal, Cursor, Magnetic, Reveal, Icon, TLink
    brand/                   Logo (traced SVG), LogoMark (C³ arc glyph)
  content/                   ALL copy + the assets manifest (edit these, not components)
  lib/                       gsap.ts, motion.ts (motion tokens), tokens.ts, schemas.ts (Zod), leads.ts, email/,
                             rate-limit.ts, lead-context.ts (page + UTM), defer.ts
  styles/tokens.css          design tokens (mirrored by lib/tokens.ts)
scripts/                     fetch-assets, asset-sources, assets-doc, shots, smoke, check-content
docs/                        reference-notes, decisions, TODO-real-content
```

## Where the design came from

The site started with two designs. On 2026-11-28 the original (v1) was removed and the influencer-led one, previously
at `/v2`, became the site. Old `/v2/*` links redirect (see `next.config.ts`). Names containing `v2` are the live
code. v1 can be recovered from git history.

## Swapping content

- **Copy:** every visible string lives in `src/content/` (`v2/home.ts`, `v2/pages.ts`, `v2/forms.ts`, `pages.ts`, `site.ts`,
  `forms.ts`, `legal.ts`). Headlines are arrays of lines; mark the accent word with
  `{ before, accent, after, style: 'block' | 'orange' | 'outline' }`.
- **Placeholders:** marked `// PLACEHOLDER` or `// CONFIRM`, listed in `docs/TODO-real-content.md`.
  When all are replaced, set `PLACEHOLDER_CONTENT = false` in `src/content/status.ts`; `pnpm check:content` then passes.

## Swapping media

Components read media only from `src/content/assets.ts`, which points at `public/media/<slot>.(mp4|webp)`.
To use your own footage, change the slot in `scripts/asset-sources.mjs`:

```js
{ slot: 'hero', provider: 'local', file: 'raw/our-hero.mp4', kind: 'video', w: 1920, h: 1080, t: 10, crf: 27 },
```

then `pnpm assets --force hero && pnpm assets:doc`. File names don't change, so no code edits.
`provider: 'pexels'` with a `query` works once `PEXELS_API_KEY` is set. Licences are tracked in `ASSETS.md`.

## Where form submissions go

Email, a Google Sheet, or both. Production needs at least one set up completely, or the server raises a
configuration error. With both, one confirmed copy counts as success and the other failure is logged.

### Google Sheet

1. **Make the sheet private:** *Share* → *General access* → **Restricted**. Add only the people who should see leads.
2. In the sheet: *Extensions* → *Apps Script*. Replace the code with `integrations/google-sheet/Code.gs` and save.
3. *Project Settings* (gear) → *Script properties* → add `LEADS_SECRET`: a long random password (at least 16 characters).
4. *Deploy* → *New deployment* → type **Web app**. *Execute as*: **Me**. *Who has access*: **Anyone**. Authorise it
   when asked. "Anyone" lets the website reach the script; requests without the password are refused. (A Google
   Workspace admin can block "Anyone"; then the account's admin has to allow it.)
5. Set `SHEETS_WEBHOOK_URL` (the web app URL ending in `/exec`) and `SHEETS_WEBHOOK_SECRET` (the same password) in
   `.env.local`, and in Vercel (*Settings → Environment Variables*), then redeploy.
6. Send one form. A **Leads** tab appears with a header row and your entry.

After editing the script: *Deploy* → *Manage deployments* → edit → *New version*, which keeps the same URL.
Submissions that look like formulas are stored as plain text.

## Form emails

Every form is emailed to the CCC team through [Resend](https://resend.com), from a Server Action only: brand
application, influencer / creator application, celebrity enquiry, model shoot enquiry, contact message and
early-access signup.

### Setup

1. **Create a Resend account** at resend.com. For first tests, sign up with the same address that should receive
   the leads (see step 4).
2. **Verify your sending domain:** Resend dashboard → *Domains* → *Add domain* → enter the domain (for example
   `contentcreationcompany.in`). Resend shows the DNS records to add (an MX and a TXT record for SPF, a TXT record
   for DKIM, and an optional DMARC record). Add exactly those at your DNS provider, then press *Verify*. DNS can take
   from a few minutes to a day or two.
3. **Create an API key:** *API Keys* → *Create API key*, permission *Sending access*. Copy it once.
4. **Fill in `.env.local`** (project root, git-ignored). Never paste the key into a chat, an issue or a source file.

   | Variable | Value |
   |---|---|
   | `RESEND_API_KEY` | the key from step 3 |
   | `LEADS_TO_EMAIL` | inbox that receives every submission |
   | `LEADS_FROM_EMAIL` | `CCC Website <leads@your-verified-domain>`; until then `CCC Website <onboarding@resend.dev>` |
   | `SEND_CONFIRMATION_EMAIL` | `true` also emails the sender a short thank-you. Leave `false` until the domain is verified |

   **Until your domain is verified, Resend's test sender (`onboarding@resend.dev`) can only deliver to the email
   address your Resend account was created with.** Sending to any other inbox fails, and the form shows its error.

### Real test send

1. Save `.env.local` with the key, then (re)start `pnpm dev`.
2. Open `http://localhost:3000/contact`, send a message, and check the inbox (and spam). Hit *Reply*: it should
   address the email you typed into the form.
3. If the form shows an error, the terminal running `pnpm dev` prints Resend's reason (`[lead] delivery failed`).
4. Open the email in Gmail and in Outlook to confirm it renders well in both.

### Behaviour

| Situation | What happens |
|---|---|
| Development, nothing configured | Submission is printed to the terminal with a warning that **nothing was sent or saved**; the form shows success |
| Production, no complete destination | Clear `Lead delivery configuration error` at server start; server requests fail until fixed |
| Resend rejects or times out | Full error logged on the server; the visitor sees a friendly message and keeps what they typed |
| More than 5 submissions from one IP in 10 minutes | Refused with a "wait a few minutes" message |
| Honeypot field filled | Pretends to succeed, sends nothing |

- **Same validation twice:** each form has its own `kind` in `src/lib/schemas.ts`; the browser and the server
  action run the same schema. A consent tick is required.
- **Email:** `src/lib/email/template.ts` (branded HTML + plain text, inline logo, all user text escaped, subjects
  stripped of control characters, Reply-To = sender). Includes every field, the form name, page, IST time and UTM tags.
- **Rate limit:** `src/lib/rate-limit.ts` is in memory, per server instance. Move it to Upstash (or similar) before
  heavy traffic. It trusts `x-real-ip` / `x-forwarded-for`, which Vercel sets itself.
- **Another destination** (database, CRM): implement `LeadAdapter.save` in `src/lib/leads.ts`; it must throw unless
  delivery is confirmed.

## Motion system

Tokens in `src/lib/motion.ts` (eases, durations, staggers, media queries). Rules: transform/opacity/clip-path
only, every GSAP setup inside `useGSAP` scoped to a ref, `gsap.matchMedia()` for reduced motion and mobile.
`ENTRANCE_MIN_WIDTH` controls where the entrance plays (desktop by default). Below-the-fold text reveals
initialise lazily (`lib/defer.ts`) to keep hydration light. See `CLAUDE.md` for the full rule set.

## Deploy (Vercel)

Zero-config Next.js on Vercel; `vercel.json` pins the Mumbai region (`bom1`) for India-first latency.
**Before deploying**, add the Google Sheet or email variables (see "Where form submissions go") in the Vercel project (*Settings → Environment Variables*, for Production and Preview). Without them the deployed server raises the configuration error. Add `pnpm check:content` to the production
build step (or CI) to block deploys while placeholders remain.

## How Phase 2 and Phase 3 plug in

- **Phase 2 (dashboards):** build in `app/(brand)` and `app/(creator)` with their own layouts (no marketing
  chrome or Lenis). Reuse `components/ui/*`, `styles/tokens.css`, `lib/schemas.ts`. Add authentication there;
  swap `leads.ts` for a DB adapter. Extracting `components/ui` + tokens into a
  `packages/ui` workspace package is a move, not a rewrite (`pnpm-workspace.yaml` is already present).
- **Phase 3 (React Native app):** import `src/lib/tokens.ts` (colours, fonts, radii, shadows: platform-agnostic)
  and `src/lib/schemas.ts` (Zod works in RN) into the app; content types in `src/content/types.ts` keep copy shareable.
