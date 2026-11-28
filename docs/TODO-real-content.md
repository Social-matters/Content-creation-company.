# TODO: real content before launch

Everything below is a placeholder or needs sign-off. Each item is marked in code with
`// PLACEHOLDER` or `// CONFIRM`; `pnpm check:content` lists them and fails until they're gone
**and** `PLACEHOLDER_CONTENT` in `src/content/status.ts` is set to `false`.
While the flag is `true`, testimonials show a visible "Sample quote" tag and every page carries
`<meta name="ccc-content" content="placeholder">`.

## Numbers and figures (invented, do not ship)

Files are under `src/content/`.

| Where | Current | File |
|---|---|---|
| Hero stat | 2,400+ influencers onboarding | `v2/home.ts` → `heroV2.stat` |
| Stats tiles (shown with a "Sample figures" tag) | 2,400+ influencers · 25+ celebrities & actors on roster · 40+ shoots · 6 cities | `v2/home.ts` → `statsV2.items` |
| How-it-works mock | 12,40,000 views, +120K today, 12 of 340 fit, follower and ER figures | `v2/home.ts` → `howV2.mock`, `howV2.chips` |
| Hero notifications | "+120K views in the last hour", handles | `v2/home.ts` → `heroV2.notifications` |

## Form option bands
- [ ] **Budget bands** on the brand form (Under ₹50K … ₹10L+): `v2/forms.ts` → `budgets`. No prices are shown anywhere on the site.

## People, names and quotes (invented, do not ship)
- **Handles** (`@ananya.styles`, `@rohan.eats`, `@meera.makes`) in hero notifications, the shortlist mock and the live feed: `v2/home.ts`.
- **Mosaic tier/niche labels** ("Micro · Food", …) on stock clips: `v2/home.ts` → `mosaicV2.tiles`.
- **Testimonials**: three sample quotes (tagged "Sample quote"). Replace with real, attributable quotes (with permission) or remove the section: `v2/home.ts` → `testimonialsV2`.
- **Celebrities and TV actors**: no names or images anywhere. Supply licensed images and any names you want shown; until then the site uses "Roster placeholder" cards and set footage.

## Claims to confirm
- [ ] **AI Influencer Matching "Live: try it now"** badge: `v2/home.ts` → `servicesV2.influencer[3].badge`.
- [ ] **"No minimum follower count"** (creator card on About): `v2/home.ts` → `creatorCtaV2.note`.
- [ ] **Celebrity page copy** (endorsements, appearances, serial actor tie-ups; "Roster shared on request"): `v2/pages.ts` → `celebritiesPage`.
- [ ] **Model Shoots page copy** (crew, studio, edited delivery): `v2/pages.ts` → `modelShootsPage`.
- [ ] **Launch cities** (mosaic copy + city marquee): `v2/home.ts` → `mosaicV2.body`, `marqueesV2.cities`.
- [ ] **Hero manifesto**: `v2/home.ts` → `heroV2.manifesto`.
- [ ] **About page problem statement**, including "middlemen who keep 40% of the fee": confirm or reword. `pages.ts` → `about.problem`.
- [ ] **Founding-brand perks** ("priority placement at launch", "priority slots, first pick of campaigns, and a direct line to the team"): `forms.ts` → `brand.intro`, `v2/home.ts` → `finaleV2.body`.
- [ ] **Compliance wording** (e.g. ASCI disclosures): deliberately left out until you confirm.
- [ ] **Social Matters wording** on About: `pages.ts` → `about.backer.body`.
- [ ] **Social handles/URLs** (Instagram, LinkedIn, YouTube, X): `site.ts` → `socials`.
- [ ] **Legal pages**: draft privacy policy and terms; need counsel review (DPDP Act 2023): `legal.ts`.
- [ ] **Copyright year** is a literal ("© 2026"): `site.ts` → `footer.copyright`.
- [ ] **The site is now indexable** (the old preview was hidden from search): clear the items above before it goes live.

## Forms and email (before launch)

- [ ] **Vercel:** add the Google Sheet variables and/or the three email variables (README → "Where form submissions go").
- [ ] **If using email:** verify the sending domain in Resend, then set `LEADS_FROM_EMAIL` to an address on it.
- [ ] **Google Sheet:** set General access to Restricted before real submissions arrive.
- [ ] **Real test:** send one form and check the email in Gmail and Outlook (only browser rendering has been checked so far).
- [ ] **Rate unit options** on the influencer form: `src/content/v2/forms.ts` → `priceUnits`.
- [ ] **Privacy policy** was updated for emailed submissions, Resend, UTM/page capture and creator rates: include it in the legal review.
- [ ] **Early-access and contact copy:** `src/content/v2/forms.ts`.
- [ ] Move the rate limit to Upstash or similar before heavy traffic.

## Media (temporary stock → CCC's own content)

All media slots are royalty-free Mixkit stock (see `ASSETS.md`). Replace with CCC's own shoots:

| Slot(s) | What it should become |
|---|---|
| `hero`, `hero-mobile` | Signature CCC shot, ideally an Indian creator filming on a phone, 10s loop |
| `mosaic-01…18, 20` | Real network influencer reels (with consent), 9:16. Ideally Indian creators shooting GRWM, unboxings and vlogs (not on the free sources) |
| `cat-food … cat-travel` | One real reel per category |
| `set-1`, `set-2` | Behind-the-scenes footage standing in for celebrity / TV work. Replace with licensed talent imagery |
| `model-1`, `model-2` | CCC's own model shoots |
| `cta-brand` | A real brand shoot day |
| `cta-creator` | Real creators from the network |
| `avatar-1…4` | Real (consenting) network creators for the hero avatar stack |

**Not found on the free sources (used closest available instead):** Mixkit's search rate-limited during
sourcing, and Pexels/Pixabay/Unsplash need API keys. Intended searches if you want better stock in the meantime:
- Travel: "travel vlogger India", "hotel room tour" (currently Pushkar ghats)
- Indian creators filming selfie reels, vertical 9:16, for the mosaic

How to swap: edit the slot in `scripts/asset-sources.mjs` (e.g. `{ slot: 'hero', provider: 'local', file: 'raw/hero.mp4', … }`),
run `pnpm assets --force hero && pnpm assets:doc`. File names stay the same, so no code changes.

## Client logos

The site shows 17 supplied logos (hero strip, band, grid), processed by
`pnpm logos` from the git-ignored folder `.incoming/client-logos/` into `public/brand/clients/` + `src/content/clients.ts`.
Nothing in the supplied folder was ignored (17 PNG files, nothing else).

- [ ] **Confirm the heading "Brands we've worked with"** is true of CCC. If these are Social Matters' clients, the wording must say so: `v2/home.ts` → `clientsV2.title`.
- [ ] **Confirm each brand has agreed** to its logo appearing on this site. The repository is public, so the processed files are public too.

**Files to ask for again** (they work, but a vector or larger transparent original would look better):

| File | Problem |
|---|---|
| `Ekadhi.png` | Jagged, broken edges in the source; thin strokes look pixelated |
| `Sri-Krishna-Silks.png` | Rough, jagged edges in the source |
| `Alchemy.png`, `She-Needs.png`, `Poornima-Prints.png`, `Ramala-Collections.png` | Fine-print taglines are unreadable at web logo sizes (a version without the tagline would help) |
| All 17 | Supplied as white art on a solid grey box, not transparent. The script removes the box; a colour or SVG original would allow use on light sections |
| `TONI-and-GUY.png` | Names two outlets (Hitec-City & Himayatnagar): confirm that is the intended lock-up |

