# Reference notes: 8x.social (design benchmark)

Studied 2026-11-26 with Playwright at 1440×900 and 390×844 (scrolled screenshots, computed styles). Used as the bar for quality, structure and feel only. No text, imagery or logo is copied.

## Stack signals
- Next.js, Lenis (`html.lenis`), and an entrance class sequence (`entrance` → `entrance-done`) that gates the hero animation.
- 29 `<video>` elements and 60 images on one ~17,500px page. Videos are short, muted, looping, portrait UGC clips with burned-in captions.

## Section order (desktop height)
1. **Hero** (100vh). Full-bleed creator photo with the backdrop visible; giant two-line headline anchored bottom-left, second line pushed right; accent word in a gradient. Stat block (big number, label, avatar stack) top-left; sub-copy + "Join the network" link right; notification card (Instagram, "now") floating top-centre; CTA pair bottom-right ("primary" + "Book a call · 15 min").
2. **Creator mosaic** (~3600px including scroll room). Sticky left column headline that swaps the last word ("HUMANS. / ACCOUNTS. / VOICE. / COMPOUNDS.") while an 8-tile staggered portrait-video grid scrolls on the right; two columns offset vertically.
3. **How it works** (~4400px, pinned). Light background. Step tabs `01 Brief / 02 Creators / 03 Review / 04 Live` with dotted progress underlines; one-line caption; a single white card morphs: brief form → creator applicant cards → approve queue → "1.0M views, Live" chart with a feed.
4. **Operations** (~850px). Headline built from vertical slat panels that rotate in like a shutter; 8 numbered cards (Sourcing, Briefing…) with big numbers; "Week 6 · Sample campaign" badge.
5. **"We run it. You get the output."** Big statement band.
6. **Proof** (~3000px). Huge headline scales down while scrolling, then a world dot-map card; a bento grid mixing video tiles, stat tiles (white) and case tiles (blue gradient) with logos.
7. **Testimonial** "They moved the budget. Here's why." Large quote with fading lines.
8. **Pricing** "You run it. Or we do." Two plans (Self Service / Full Service) with a phone mock in between.
9. **Brand CTA** "Your category is about to break out." Giant gradient last line, CTA pair right.
10. **Creator CTA card**: rounded card, photo of a group of creators on the right fading into the gradient, "You post. We pay.", primary + text link.
11. **Footer**: light, rounded top corners overlapping the dark section, logo + one-liner + socials left, 3 link columns right (Brands / Creators / Company), legal row.

## Type scale (desktop 1440)
| Role | Font | Size / line-height | Tracking |
|---|---|---|---|
| Hero display | Archivo 900, uppercase | 164px / 0.86 | −0.004em |
| Section display | Archivo 900, uppercase | 100–175px / 0.86 | −0.004em |
| Card title | Archivo 900, uppercase | 26–54px / 0.9 | ≈0 |
| Lead | Hanken Grotesk 500 | 24–30px / 1.4 | −0.01em |
| Body | Hanken Grotesk 400 | 15–18px / 1.45 | 0 |
| Labels / step numbers | Geist Mono 500 | 13–15px | 0 |

Display line-height is very tight (~0.86) so two-line headlines read as a block. Mobile hero display ≈ 56px.

## Spacing rhythm
- Page gutter 48px desktop, 18–20px mobile.
- Section padding 80–110px top. Pinned sections use 3–5× viewport height of scroll room.
- Cards use 20–24px radius, 14–20px internal padding. Pills are fully rounded with 6px inset icon circles.

## Motion patterns observed
- Entrance sequence before the hero; hero headline lines rise from masks.
- Pinned scroll scenes with scrubbed state changes (the how-it-works card and the mosaic word swap).
- Number roll (odometer columns of 0–9 per digit, visible in the DOM).
- Shutter/slat reveal on a headline; scale-down of a giant headline on scroll.
- Hover lifts on cards; nav pill with active-state background.
- Mobile keeps the same order, drops pinning for stacked steps, and keeps the notification card over the hero photo.

## Mock-UI panels
- Glassy dark notification card (app icon, app name, "now", message, thumbnail).
- White product cards with soft shadow, 20px radius, mono numerals, dotted slider, gradient CTA.
- "Live" indicator dot + views chart with "+184K today"; "Sample data" footnote (good practice: they label sample figures).

## What CCC does differently
- Brand palette: ink `#141210` / cream `#F1EDE4` / orange `#FF812A` instead of cobalt gradients.
- Neo-brutalist signature: hard black offset shadows, 2px black borders, tilted black highlight block on the accent word, black "dot" pill badges.
- Archivo Black + Bricolage Grotesque + JetBrains Mono.
- India-first content: ₹ pricing, Indian cities, our four real offers (Content Exhibition, Creator Visit, Pay-On-Performance, AI Creator Marketplace).
