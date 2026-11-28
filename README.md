# Content Creation Company — marketing site (Phase 1)

The public site for **Content Creation Company (CCC)**, India's creator-commerce and AI-powered content
marketplace. Next.js 16 · TypeScript · Tailwind v4 · GSAP (ScrollTrigger, SplitText, Flip) · Lenis · motion.

Phase 1 of 3: marketing site (this repo) → Phase 2 brand/creator dashboards → Phase 3 mobile app.

## Setup

Requirements: Node 20+ (24 tested), pnpm 10+, ffmpeg (only for `pnpm assets`).

```bash
pnpm install
cp .env.example .env.local     # optional: PEXELS_API_KEY, RESEND_API_KEY
pnpm dev                       # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` / `build` / `start` | Next.js dev server / production build / serve the build |
| `pnpm lint` · `pnpm typecheck` | ESLint · route typegen + `tsc --noEmit` |
| `pnpm shots [route…] [--w=1440,768,390] [--entrance] [--reduced]` | Scrolls routes in Playwright, saves screenshots to `shots/`, prints console errors |
| `pnpm smoke` | Interaction test: entrance, modal, validation, lead submit, Esc, route wipe, Flip toggle, mobile menu, FAQ, skip link, reduced motion |
| `pnpm assets [slot] [--force]` | Downloads + compresses media into `public/media/` (ffmpeg) |
| `pnpm assets:doc` | Regenerates `ASSETS.md` from the asset sources |
| `pnpm check:content` | Fails while placeholder content remains (use in CI before production) |

`pnpm shots` / `pnpm smoke` need a running server (`BASE_URL`, default `http://localhost:3000`) and Playwright's
Chromium (`npx playwright install chromium`). On Git Bash for Windows prefix route args with `MSYS_NO_PATHCONV=1`.

> **Dev-server quirk:** if a page shows a hydration mismatch right after you edited a client component,
> restart `pnpm dev` (stale server bundle). Production builds are unaffected.

## Structure

```
src/
  app/
    layout.tsx               fonts, metadata, JSON-LD, entrance pre-paint script
    (marketing)/             every public route (shares MarketingShell)
      page.tsx               home (13 sections)
      creators/ pricing/ about/ contact/ privacy/ terms/
      start-a-campaign/ join-as-creator/   form pages (same forms as the modals)
      styleguide/            hidden design-system page (noindex)
    (brand)/ (creator)/      reserved for Phase 2 (README only)
    actions.ts               server action: validate + hand lead to the adapter
    not-found.tsx · opengraph-image.tsx · robots.ts · sitemap.ts · icon.png
  components/
    providers/               SmoothScroll (Lenis⇄GSAP), UIProvider (modals, entrance), PageTransition (orange wipe)
    layout/                  MarketingShell, Nav, MobileMenu, Footer, Preloader, LazyChrome
    sections/                one file per page section
    forms/                   LeadForms (brand, creator, login), fields, success state, ModalHost
    ui/                      Button, Badge, Card, Headline (SplitText + tilted block), Counter, Marquee,
                             Video, PhoneFrame, Modal, Cursor, Magnetic, Reveal, Icon, TLink
    brand/                   Logo (traced SVG), LogoMark (C³ arc glyph)
  content/                   ALL copy + the assets manifest (edit these, not components)
  lib/                       gsap.ts, motion.ts (motion tokens), tokens.ts, schemas.ts (Zod), leads.ts, defer.ts
  styles/tokens.css          design tokens (mirrored by lib/tokens.ts)
scripts/                     fetch-assets, asset-sources, assets-doc, shots, smoke, check-content
docs/                        reference-notes, decisions, TODO-real-content
```

## v2 design (`/v2`)

A second, influencer-led version of the site lives at `/v2/*` (home, celebrities, model shoots, about, contact,
forms, legal) so the two can be compared on one deployment. It is `noindex`; see `CLAUDE.md` → "Two versions"
for its positioning, nav and copy rules.

- **Routes:** `src/app/v2/` with `MarketingShell version="v2"`. Links inside v2 stay in v2 automatically (`TLink`).
  `/v2/creators` and `/v2/pricing` redirect to `/v2`.
- **Copy:** `src/content/v2/` (`home.ts`, `site.ts`, `pages.ts`, `forms.ts`). v1 copy in `src/content/*.ts` is separate.
- **Sections:** `src/components/v2/` (HeroV2, MosaicV2, ServicesV2, HowItWorksV2 + screens, OperationsV2, ProofV2,
  StatsV2, VoicesV2, FinaleV2, PageHeroV2) and the motion helpers in `v2/flow.tsx`. Shared components
  (Nav, Footer, Comparison, forms) take v2 content as props or read `useSiteVersion()`.
- **Look and feel:** the `.v2` scope in `styles/tokens.css` sets the roomier spacing and calmer type scale;
  `flow` in `lib/motion.ts` is the softer, scroll-linked motion profile.
- **Removing v2:** delete `src/app/v2`, `src/components/v2` and `src/content/v2`, the redirects in `next.config.ts`,
  and the v2 branches in the shared components.

## Swapping content

- **Copy:** every visible string lives in `src/content/*.ts` (`home.ts`, `creators.ts`, `pages.ts`, `site.ts`,
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

## Leads

Forms validate with Zod on both client and server (`src/lib/schemas.ts`), include a honeypot, and submit through
the `submitLead` server action to `src/lib/leads.ts`:

- `RESEND_API_KEY` set → emailed to `LEADS_TO_EMAIL` via Resend
- development → appended to `.leads/leads.jsonl` (+ console)
- otherwise → structured `console.info('[lead]', …)` (visible in Vercel logs)

Add a database adapter by implementing `LeadAdapter.save` in `leads.ts`.

## Motion system

Tokens in `src/lib/motion.ts` (eases, durations, staggers, media queries). Rules: transform/opacity/clip-path
only, every GSAP setup inside `useGSAP` scoped to a ref, `gsap.matchMedia()` for reduced motion and mobile.
`ENTRANCE_MIN_WIDTH` controls where the entrance plays (desktop by default). Below-the-fold text reveals
initialise lazily (`lib/defer.ts`) to keep hydration light. See `CLAUDE.md` for the full rule set.

## Deploy (Vercel)

Zero-config Next.js on Vercel; `vercel.json` pins the Mumbai region (`bom1`) for India-first latency.
Set `RESEND_API_KEY` and `LEADS_TO_EMAIL` in the Vercel project. Add `pnpm check:content` to the production
build step (or CI) to block deploys while placeholders remain.

## How Phase 2 and Phase 3 plug in

- **Phase 2 (dashboards):** build in `app/(brand)` and `app/(creator)` with their own layouts (no marketing
  chrome or Lenis). Reuse `components/ui/*`, `styles/tokens.css`, `lib/schemas.ts`. The login modal
  (`LoginForm`) is the hook for auth; swap `leads.ts` for a DB adapter. Extracting `components/ui` + tokens into a
  `packages/ui` workspace package is a move, not a rewrite (`pnpm-workspace.yaml` is already present).
- **Phase 3 (React Native app):** import `src/lib/tokens.ts` (colours, fonts, radii, shadows: platform-agnostic)
  and `src/lib/schemas.ts` (Zod works in RN) into the app; content types in `src/content/types.ts` keep copy shareable.
