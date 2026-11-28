# CLAUDE.md — Content Creation Company (CCC) marketing site

Phase 1 of 3: marketing website. Phase 2 = brand/creator dashboards (`app/(brand)`, `app/(creator)`, reserved, empty). Phase 3 = mobile app (reuses `src/lib/tokens.ts`). Do not build Phase 2/3 here.

Quality bar: award-level. Cinematic, smooth, confident, fast. If it feels average, redo it.

@AGENTS.md

> Next.js here is **16.4** with `cacheComponents` + `partialPrefetching` on. Read `node_modules/next/dist/docs/` before using an unfamiliar API. Routes stay mounted but hidden (React `<Activity>`) after navigation, so: never query the document globally for animation targets; always scope GSAP to a ref, and expect effects to unmount/remount on hide/show.

## One site

There is one site. The earlier original design (v1) was removed on 2026-11-28 and the influencer-led design that lived at `/v2` is now served from `/` (old `/v2/*` links redirect). Some folder, file and export names still carry `v2` (`src/content/v2/`, `src/components/v2/`, `HeroV2`, `servicesV2`): they are the live ones. Shared copy (site name, nav, footer, pages, forms, legal) is in `src/content/*.ts`; home and form copy is in `src/content/v2/`. The site is indexable.

### Positioning (influencer-led)
- CCC is **mainly an influencer-marketing company; creator content supports it** (roughly 70/30). Show this through weight (section count, screen height, imagery, copy order), never by printing "70/30" or any ratio as a claim.
- Influencer side first and large: influencer campaigns, celebrity and TV serial actor tie-ups, pay-on-performance, AI influencer matching. Creator-content side second and compact: model shoots, creator visit, content exhibition.
- Hero: "Influence. Content. Results." with the tilted block on "Results.".

### Nav rules
- One brand-facing site: **no Brands/Creators toggle** and no audience-dependent copy. Nav = Influencers · Celebrities · Model Shoots · How it works, then **Join the network** (links to `/contact#join-the-network`). No login anywhere (owner's decision).
- **No public pricing anywhere** (owner's decision): no prices, rupee amounts, price units or fee terms in pages, content, metadata or structured data. No pricing page or plans section. Each service card shows **Contact for pricing**, linking to `join-the-network` with `?service=`. The budget-range and base-rate form inputs stay: we collect those, we don't show prices.
- Influencers, creators and models join through a quiet footer link and the band at the end of the home page ("Join our influencer network"), never the header.

### Copy rules
- No invented facts. No celebrity or actor names, roster sizes or results unless CCC provides them. Every number, name and testimonial is `// PLACEHOLDER` (claims to verify: `// CONFIRM`) and listed in `docs/TODO-real-content.md`; placeholder stats and quotes show a visible "Sample" tag while `PLACEHOLDER_CONTENT` is on.
- Never imply a real celebrity endorses CCC. No identifiable celebrity or actor imagery: use set atmosphere (hands, gear, lights) or the "Roster placeholder" card until licensed images arrive.
- No compliance claims (e.g. "ASCI-compliant disclosures") until CCC confirms them.
- Client logos come only from files the owner supplies, via `pnpm logos` (never scraped or substituted). Raw files stay in the git-ignored `.incoming/`.

---

## 2. Tech stack (decided; don't swap without asking)

- **Next.js (App Router) + TypeScript (strict)**
- **Tailwind CSS v4**, design tokens as CSS variables in `src/styles/tokens.css`, mirrored in `src/lib/tokens.ts` (the future React Native app reuses the TS tokens). Keep both in sync.
- **GSAP** (core, ScrollTrigger, SplitText) with `@gsap/react` (`useGSAP`) for all scroll and timeline animation. Plugins are registered once in `src/lib/gsap.ts`; import gsap from there.
- **Lenis** smooth scroll, synced with GSAP's ticker (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add`, `gsap.ticker.lagSmoothing(0)`).
- **motion** (Framer Motion) only for small UI state transitions (modals, toggles, tabs). Never mix it with GSAP on the same element.
- **next/font** for fonts, **next/image** for images, **Zod** + React Hook Form for forms.
- **pnpm**. Monorepo-ready structure.
- Route groups: `app/(marketing)/…` now; `app/(brand)/` and `app/(creator)/` reserved for Phase 2 (README note only).
- Deploy target: Vercel.

## 3. Brand

Logo `public/brand/ccc-logo.png` (source: contentcreationcompany.in), SVG wordmark in `src/components/brand/Logo.tsx`. Favicon mark `public/brand/favicon.png`. Footer credit: "An Initiation by Social Matters".

| Token | Hex | Use |
|---|---|---|
| `--ccc-orange` | `#FF812A` | Primary accent, CTAs, highlights, any text on ink |
| `--ccc-orange-text` | `#B34A0B` | Small orange text on cream/white (AA) |
| `--ccc-orange-display` | `#D4570F` | Orange display accents on cream/white (AA large) |
| `--ccc-black` | `#000000` | Borders, hard shadows, headline ink on light |
| `--ccc-ink` | `#141210` | Dark section backgrounds |
| `--ccc-cream` | `#F1EDE4` | Light section background |
| `--ccc-stone` | `#C4BFB8` | Muted text/dividers |
| `--ccc-white` | `#FFFFFF` | Text on dark |

Fonts (next/font/google): Display **Archivo Black** (all-caps headlines) · Body **Bricolage Grotesque** · Mono labels **JetBrains Mono**.

Signature look: tilted black highlight block behind a headline word; hard offset black drop-shadows (neo-brutalist); black "COMING SOON"-style pill badge with a small orange dot; orange pill buttons with black border + arrow icon; soft blurred orange radial glow behind the hero.

Design direction: dark ink (`#141210`) hero and key sections with orange as the electric accent, alternating with cream sections. Neo-brutalist details (hard shadows, tilted highlight, bold borders) are our signature so it never reads as a clone of the reference (8x.social).

## 4. Motion system (the most important part)

Shared tokens live in `src/lib/motion.ts`. Use them everywhere.

- Eases: `expo.out` for reveals, `power3.inOut` for transitions, `cubic-bezier(.16,1,.3,1)` in CSS. Durations: micro 0.25s, reveal 0.9–1.2s, section 1.4s. Stagger 0.06–0.12s.
- Animate only `transform` and `opacity` (plus `clip-path` for masks). Never animate layout properties. `will-change` sparingly, removed after.

Must-have effects:
1. Entrance/preloader (~1.6–2.2s): logo mark draws in, counter 0→100, orange panel wipes up to reveal the hero. Skipped on repeat visits in the session. Hero animation starts only after it finishes.
2. Lenis smooth scroll site-wide; anchors use `lenis.scrollTo`. Disabled for `prefers-reduced-motion`.
3. Headline reveals: SplitText by lines inside `overflow:hidden` masks, lines slide up with stagger. Accent word gets an extra underline/tilted-block animation.
4. Hero: full-bleed video/photo with subtle scroll parallax + scale; floating notification cards enter staggered then drift in a looped float with different phases; avatar stack pops in; stat counter rolls up.
5. Creator mosaic: ~20 portrait tiles, staggered reveal from centre outward, per-column parallax, hover: scale + play muted preview.
6. How it works (pinned scrub): four steps (Brief → Match → Review → Live); the phone/mock UI morphs between four states. One ScrollTrigger timeline, `scrub: 1`, `pin: true`.
7. Marquee bands: infinite, opposite directions, speed reacts to scroll velocity and eases back, pause on hover. GSAP/rAF, not CSS jumps.
8. Operations grid: 8 numbered cards, stagger-in, 3D tilt on hover with cursor-following highlight.
9. Number counters: odometer-style rolling digits on viewport entry (once).
10. Proof by category: looping muted videos in rounded frames, clip-path curtain reveal; play only in viewport (IntersectionObserver).
11. Magnetic buttons + custom cursor (fine pointer only): dot + ring; ring grows with a label over videos/cards; hidden on touch.
12. Nav: pill nav hides on scroll down, shows on scroll up, blurred bg after the hero; full-screen mobile menu with staggered links.
13. Modals ("Start a campaign", join the network): scale+fade, backdrop blur, focus-trapped, Esc closes.
14. Page transitions between routes (short orange wipe).
15. Footer: giant CCC wordmark that reveals/parallaxes into view.

Performance and accessibility (non-negotiable):
- `prefers-reduced-motion`: disable Lenis, pinning, parallax, marquees; fall back to simple fades. Use `gsap.matchMedia()`.
- Simplify/disable pinned scrub and cursor effects on mobile; keep reveals.
- Every GSAP setup inside `useGSAP` with a scope, cleaned up on unmount. No leaked ScrollTriggers. `ScrollTrigger.refresh()` after fonts and media load.
- Steady 60fps. No layout shift from animations (CLS < 0.05).
- Use `playOnce` (toggleActions) for play-once triggers, never `once: true`.
- No backdrop-filter / CSS blur / blend modes over playing video; no per-frame GSAP loops for idle motion (use CSS keyframes).
- Below-the-fold text reveals initialise via `whenNear` (lib/defer.ts); pins/parallax initialise eagerly.

## 8. Assets (temporary now, swapped later)

- **One manifest:** `src/content/assets.ts` maps every slot to `{ src, poster, alt, credit }`. Components read media only from it.
- **Royalty-free sources only:** Pexels, Pixabay, Unsplash (photos); Pexels/Pixabay/Coverr/Mixkit (videos).
- **Never scrape or download from Pinterest.** Mood board only. Licensed images handed over by the owner go in `public/assets/`.
- `scripts/fetch-assets.mjs` downloads chosen files (Pexels API key in `.env.local` as `PEXELS_API_KEY`; see `.env.example`). If something can't be downloaded, use a tasteful gradient/blurred placeholder, note the intended search term in a comment, and list it in `docs/TODO-real-content.md`.
- Compress: images WebP/AVIF with explicit width/height; video MP4 H.264, muted, `playsInline`, loop, ≲2MB per tile, ≲6MB hero, with poster frame. Never autoplay with sound.
- `ASSETS.md` lists every asset with source URL, author, licence.
- No real faces in mock-UI panels unless licensed; use abstract avatars there.

## 9. Definition of done

- [ ] Every home section exists, is responsive, and has its animation
- [ ] On par with 8x.social in motion quality, clearly CCC (orange/cream/ink, Archivo Black, neo-brutalist)
- [ ] 60fps scrolling on a mid-range laptop; no console errors or hydration warnings
- [ ] Reduced-motion and mobile fallbacks work
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility/SEO ≥ 95; keyboard + screen-reader pass
- [ ] All text in `src/content`, all media in the assets manifest; `docs/TODO-real-content.md` accurate
- [ ] Forms validate and submit through the adapter (`src/lib/leads.ts`); animated success states, shown only after delivery is confirmed
- [ ] `README.md` covers setup, scripts, structure, swapping content/assets, and how Phase 2/3 plug in
- [ ] Clean commits per phase

## Form submissions
- Every lead form goes to email (Resend) and/or the team's Google Sheet, from the server action only (`lib/leads.ts`, `lib/lead-config.ts`, `lib/sheet.ts`, `integrations/google-sheet/`).
- Never hardcode or commit the recipient address or any key: they live in `.env.local` and Vercel. The repo is public.
- A new form gets its own `kind` in `lib/schemas.ts` (same schema client and server), the consent checkbox, a subject in `lib/email/template.ts` and a case in `scripts/test-forms.mjs`. Run `pnpm test:forms`.
- Escape all user text in emails; clean it before it goes into a subject.

## Working rules

- Copy lives only in `src/content/*.ts`. Placeholders are marked `// PLACEHOLDER` and listed in `docs/TODO-real-content.md`. Never present invented stats/testimonials as real.
- Decisions go in `docs/decisions.md`. Ask only when blocked or a decision is expensive to reverse.
- Verify visually with Playwright screenshots (`pnpm shots`) at 1440 / 768 / 390 before calling something done.
- Small typed components. No dead code, no unused deps.
