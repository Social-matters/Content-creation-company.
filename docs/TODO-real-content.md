# TODO: real content before launch

Everything below is a placeholder or needs sign-off. Each item is marked in code with
`// PLACEHOLDER` or `// CONFIRM`; `pnpm check:content` lists them and fails until they're gone
**and** `PLACEHOLDER_CONTENT` in `src/content/status.ts` is set to `false`.
While the flag is `true`, testimonials show a visible "Sample quote" tag and every page carries
`<meta name="ccc-content" content="placeholder">`.

## Numbers (invented, do not ship)

| Where | Current | File |
|---|---|---|
| Hero stat | 2,400+ creators onboarding | `src/content/home.ts` → `hero.stat` |
| Early numbers | 2,400+ creators · 4 revenue models · 6 cities (8 categories is real) | `home.ts` → `stats.items` |
| Founding-brand slots | 12 total, 5 reserved | `home.ts` → `stats.slotsTotal/slotsTaken` |
| How-it-works mock | 12,40,000 views, +86K today, 12 of 340 matched, chip figures | `home.ts` → `howItWorks.mock`, `howItWorks.chips` |
| Self-serve credits | "Credits from ₹10K" | `home.ts` → `plans.items['Self-serve'].priceNote` |

## People and quotes (invented, do not ship)

- **Testimonials**: three sample quotes with generic roles. Replace with real, attributable quotes (with permission) or remove the section: `home.ts` → `testimonials`.
- **Creator handles** in hero notifications, the match screen and the live feed (`@priya.eats`, `@ananya.brews`, `@rohan.daily`, `@meera.makes`): `home.ts`, `creators.ts` → `creatorsHero.notifications` (also illustrative payout ₹8,500).

## Claims to confirm

- [ ] **"No minimum follower count"** (creator CTA note + creators FAQ): `home.ts` → `creatorCta.note`, `creators.ts` → `creatorFaq`.
- [ ] **AI Creator Marketplace badge "Live"**: the live site lists it under "What's coming". `home.ts` → `services.items[3].badge`.
- [ ] **Launch cities** (mosaic copy + city marquee): `home.ts` → `mosaic.body`, `marquees.cities`.
- [ ] **Payout timing and performance bonuses** (creators "Get paid" step + FAQ): `creators.ts`.
- [ ] **Pricing FAQ answers** (GST, success-fee tiers, founding pricing): `pages.ts` → `pricingPage.faq`.
- [ ] **Social Matters wording** on About: `pages.ts` → `about.backer.body`.
- [ ] **Social handles/URLs** (Instagram, LinkedIn, YouTube, X): `site.ts` → `socials`.
- [ ] **Legal pages**: draft privacy policy and terms; need counsel review (DPDP Act 2023): `src/content/legal.ts`.
- [ ] **Copyright year** is a literal ("© 2026"): `site.ts` → `footer.copyright`.

## v2 (`/v2`): influencer-led version

v2 copy lives in `src/content/v2/`. Same rules: everything below is invented or needs sign-off.

### Numbers and figures (invented, do not ship)
| Where | Current | File |
|---|---|---|
| Hero stat | 2,400+ influencers onboarding | `v2/home.ts` → `heroV2.stat` |
| Stats tiles (shown with a "Sample figures" tag) | 2,400+ influencers · 25+ celebrities & actors on roster · 40+ shoots · 6 cities | `v2/home.ts` → `statsV2.items` |
| How-it-works mock | 12,40,000 views, +120K today, 12 of 340 fit, follower and ER figures | `v2/home.ts` → `howV2.mock`, `howV2.chips` |
| Hero notifications | "+120K views in the last hour", handles | `v2/home.ts` → `heroV2.notifications` |

### Prices to confirm
- [ ] **Influencer Campaigns** "Custom quote", **Celebrity & TV Serial Actor Tie-ups** "On request", **Model Shoots** "Custom quote": `v2/home.ts` → `servicesV2`.
- [ ] **Budget bands** on the brand form (Under ₹50K … ₹10L+): `v2/forms.ts` → `budgets`.

### People, names and quotes (invented, do not ship)
- **Handles** (`@ananya.styles`, `@rohan.eats`, `@meera.makes`) in hero notifications, the shortlist mock and the live feed: `v2/home.ts`.
- **Mosaic tier/niche labels** ("Micro · Food", …) on stock clips: `v2/home.ts` → `mosaicV2.tiles`.
- **Testimonials**: three sample quotes (tagged "Sample quote"): `v2/home.ts` → `testimonialsV2`.
- **Celebrities and TV actors**: no names or images anywhere. Supply licensed images and any names you want shown; until then the site uses "Roster placeholder" cards and set footage.

### Claims to confirm
- [ ] **Comparison, CCC column**: AI-scored audience-quality vetting, celebrity/TV actor access arranged, models and crew provided, AI brief + matching built in, pay-on-performance available, contracts/payments/reporting handled, flat package pricing: `v2/home.ts` → `comparisonV2`.
- [ ] **AI Influencer Matching "Live: try it now"** badge: `v2/home.ts` → `servicesV2.influencer[3].badge`.
- [ ] **Celebrity page copy** (endorsements, appearances, serial actor tie-ups; "Roster shared on request"): `v2/pages.ts` → `celebritiesPage`.
- [ ] **Model Shoots page copy** (crew, studio, edited delivery): `v2/pages.ts` → `modelShootsPage`.
- [ ] **Launch cities** (mosaic copy + city marquee): `v2/home.ts` → `mosaicV2.body`, `marqueesV2.cities`.
- [ ] **Hero manifesto**: `v2/home.ts` → `heroV2.manifesto`.
- [ ] **Compliance wording** (e.g. ASCI disclosures): deliberately left out until you confirm.

### Media
- Influencer mosaic and proof reuse the Mixkit stock below. Wanted from CCC: real network influencer reels (with consent), ideally Indian creators shooting GRWM, unboxings and vlogs (not available on the free sources).
- `set-1`, `set-2`: behind-the-scenes set footage standing in for celebrity / TV work. Replace with licensed talent imagery when available.
- `model-1`, `model-2`: stock model shoots. Replace with CCC's own shoots.

## Media (temporary stock → CCC's own content)

All 45 media slots are royalty-free Mixkit stock (see `ASSETS.md`). Replace with CCC's own shoots:

| Slot(s) | What it should become |
|---|---|
| `hero`, `hero-mobile` | Signature CCC creator shot, ideally an Indian creator filming on a phone, 10s loop |
| `mosaic-01…20` | 20 real network creators' reels (with consent), 9:16 |
| `cat-food … cat-home` | One real reel per launch category |
| `cta-brand` | A real Content Exhibition / brand-day shoot |
| `cta-creator`, `creators-hero*` | Real creators from the network |
| `avatar-1…5` | Real (consenting) network creators for the hero avatar stack |
| `ui-*` | Product stills from real campaigns (no faces) |

**Not found on the free sources (used closest available instead):** Mixkit's search rate-limited during
sourcing, and Pexels/Pixabay/Unsplash need API keys. Intended searches if you want better stock in the meantime:
- Tech & Gadgets: "phone unboxing hands", "tech review creator desk" (currently a camera-rig desk shot)
- Home & Decor: "living room makeover", "home decor haul" (currently a kitchen interior)
- Travel: "travel vlogger India", "hotel room tour" (currently Pushkar ghats)
- Indian creators filming selfie reels, vertical 9:16, for the mosaic

How to swap: edit the slot in `scripts/asset-sources.mjs` (e.g. `{ slot: 'hero', provider: 'local', file: 'raw/hero.mp4', … }`),
run `pnpm assets --force hero && pnpm assets:doc`. File names stay the same, so no code changes.

## Client logos

**v1** uses none (open "Your brand" slots). **v2** shows 17 supplied logos (hero strip, band, grid), processed by
`pnpm logos` from the git-ignored folder `.incoming/client-logos/` into `public/brand/clients/` + `src/content/clients.ts`.
Nothing in the supplied folder was ignored (17 PNG files, nothing else).

- [ ] **Confirm the heading "Brands we've worked with"** is true of CCC. If these are Social Matters' clients, the wording must say so: `src/content/v2/home.ts` → `clientsV2.title`.
- [ ] **Confirm each brand has agreed** to its logo appearing on this site. The repository is public, so the processed files are public too.

**Files to ask for again** (they work, but a vector or larger transparent original would look better):

| File | Problem |
|---|---|
| `Ekadhi.png` | Jagged, broken edges in the source; thin strokes look pixelated |
| `Sri-Krishna-Silks.png` | Rough, jagged edges in the source |
| `Alchemy.png`, `She-Needs.png`, `Poornima-Prints.png`, `Ramala-Collections.png` | Fine-print taglines are unreadable at web logo sizes (a version without the tagline would help) |
| All 17 | Supplied as white art on a solid grey box, not transparent. The script removes the box; a colour or SVG original would allow use on light sections |
| `TONI-and-GUY.png` | Names two outlets (Hitec-City & Himayatnagar): confirm that is the intended lock-up |

