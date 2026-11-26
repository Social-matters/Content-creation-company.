# Decisions log

Decisions made without asking (per "decide, note it, continue"). Newest last.

| # | Date | Decision | Why |
|---|---|---|---|
| 1 | 2026-11-26 | **Next.js 16.4** (latest stable from `create-next-app`) with its defaults `cacheComponents` + `partialPrefetching` kept on. | Latest stable as briefed. Cache Components keeps visited routes mounted-but-hidden (`<Activity>`), so all GSAP is ref-scoped and cleaned up in `useGSAP`. If it ever fights the pinned scenes, set `cacheComponents: false` in `next.config.ts`. |
| 2 | 2026-11-26 | **pnpm 12** installed globally (was missing). | Stack requirement. |
| 3 | 2026-11-26 | **Media from Mixkit**, not Pexels. | No `PEXELS_API_KEY` was available; Pexels/Pixabay/Unsplash block keyless access. Mixkit is on the approved video list, free for commercial use, no attribution required. `scripts/fetch-assets.mjs` still supports Pexels (set the key and add `provider: 'pexels'` entries). Mixkit's listing pages rate-limited further searches, so travel/tech/home use the closest clips already catalogued. |
| 4 | 2026-11-26 | **Logo SVG traced** from the official PNG with potrace (two layers: orange letters, black extrusion). | Brief asked for a clean SVG wordmark. Source PNG kept in `public/brand/`. |
| 5 | 2026-11-26 | **Preloader mark is a hand-built C³ arc glyph** (`LogoMark`), not the traced favicon. | The traced favicon was 90 KB of path data and can't be stroke-drawn; the arc glyph echoes it, is tiny, and draws in cleanly. Favicon itself is the original PNG (`app/icon.png`). |
| 6 | 2026-11-26 | **Every page starts with an ink hero**, so the nav is always cream-on-ink. | One nav colour scheme, no contrast flips mid-transition. |
| 7 | 2026-11-26 | **Tilted highlight block**: orange block + ink text on dark sections; black block + orange text on cream. | A black block disappears on ink. Keeps the live site's signature on both backgrounds. |
| 8 | 2026-11-26 | **Page transitions are a GSAP orange wipe** (`PageTransitionProvider` + `TLink`), not React `<ViewTransition>`. | Exact control over timing/easing, works in every browser, coordinates with Lenis scroll reset. |
| 9 | 2026-11-26 | **Operations headline reworded** to "You brief. We run the rest." instead of "We run it. You get the output." | The briefed line is 8x.social's verbatim headline; the originality rule wins. Easy to change in `src/content/home.ts` if you prefer. |
| 10 | 2026-11-26 | **Plans section added to home** (after Perks, before the brand CTA) and also served at `/pricing`. | Section 4 asks for the Self-serve/Managed Flip toggle; the reference places plans just before the closing CTA. |
| 11 | 2026-11-26 | **Testimonials show a visible "Sample quote" tag** while `PLACEHOLDER_CONTENT` is true. | "Never present invented testimonials as real." The tag disappears when the flag is flipped after real quotes go in. |
| 12 | 2026-11-26 | **Founding-brand logo strip shows open "Your brand" slots** instead of fake logos. | Honest for a pre-launch company and on-message for early access. |
| 13 | 2026-11-26 | **Numbers use Indian digit grouping** (`12,40,000`). | India-first audience. |
| 14 | 2026-11-26 | **Form pages** live at `/start-a-campaign` and `/join-as-creator`; the same forms open as modals. | Shareable URLs for ads/DMs; modals for in-page conversion. |
| 15 | 2026-11-26 | **Leads adapter**: Resend (via `fetch`, no SDK) when `RESEND_API_KEY` is set; `.leads/leads.jsonl` in dev; structured console log otherwise. | Works today, swaps to email/DB later without touching forms. |
