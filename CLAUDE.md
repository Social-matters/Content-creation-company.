# CLAUDE.md — Content Creation Company (CCC) marketing site

Phase 1 of 3: marketing website. Phase 2 = brand/creator dashboards (`app/(brand)`, `app/(creator)`, reserved, empty). Phase 3 = mobile app (reuses `src/lib/tokens.ts`). Do not build Phase 2/3 here.

Quality bar: award-level. Cinematic, smooth, confident, fast. If it feels average, redo it.

@AGENTS.md

> Next.js here is **16.4** with `cacheComponents` + `partialPrefetching` on. Read `node_modules/next/dist/docs/` before using an unfamiliar API. Routes stay mounted but hidden (React `<Activity>`) after navigation, so: never query the document globally for animation targets; always scope GSAP to a ref, and expect effects to unmount/remount on hide/show.

---

## 2. Tech stack (decided; don't swap without asking)

- **Next.js (App Router) + TypeScript (strict)**
- **Tailwind CSS v4**, design tokens as CSS variables in `src/styles/tokens.css`, mirrored in `src/lib/tokens.ts` (the future React Native app reuses the TS tokens). Keep both in sync.
- **GSAP** (core, ScrollTrigger, SplitText, Flip) with `@gsap/react` (`useGSAP`) for all scroll and timeline animation. Plugins are registered once in `src/lib/gsap.ts`; import gsap from there.
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
| `--ccc-orange` | `#FF812A` | Primary accent, CTAs, highlights |
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
11. Plan comparison: cards lift on hover; Self-serve/Managed toggle with Flip.
12. Magnetic buttons + custom cursor (fine pointer only): dot + ring; ring grows with a label over videos/cards; hidden on touch.
13. Nav: pill nav hides on scroll down, shows on scroll up, blurred bg after the hero; Brands/Creators toggle with sliding pill; full-screen mobile menu with staggered links.
14. Modals ("Start a campaign", login): scale+fade, backdrop blur, focus-trapped, Esc closes.
15. Page transitions between routes (short orange wipe).
16. Footer: giant CCC wordmark that reveals/parallaxes into view.

Performance and accessibility (non-negotiable):
- `prefers-reduced-motion`: disable Lenis, pinning, parallax, marquees; fall back to simple fades. Use `gsap.matchMedia()`.
- Simplify/disable pinned scrub and cursor effects on mobile; keep reveals.
- Every GSAP setup inside `useGSAP` with a scope, cleaned up on unmount. No leaked ScrollTriggers. `ScrollTrigger.refresh()` after fonts and media load.
- Steady 60fps. No layout shift from animations (CLS < 0.05).

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
- [ ] Forms validate and submit through the adapter (`src/lib/leads.ts`); animated success states
- [ ] `README.md` covers setup, scripts, structure, swapping content/assets, and how Phase 2/3 plug in
- [ ] Clean commits per phase

## Working rules

- Copy lives only in `src/content/*.ts`. Placeholders are marked `// PLACEHOLDER` and listed in `docs/TODO-real-content.md`. Never present invented stats/testimonials as real.
- Decisions go in `docs/decisions.md`. Ask only when blocked or a decision is expensive to reverse.
- Verify visually with Playwright screenshots (`pnpm shots`) at 1440 / 768 / 390 before calling something done.
- Small typed components. No dead code, no unused deps.
