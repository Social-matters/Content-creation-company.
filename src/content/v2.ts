/**
 * Copy used only by the v2 design (/v2/*). Everything else in v2 reads the same content
 * files as v1 (home.ts, creators.ts, pages.ts…), so edits there update both versions.
 */
export const v2Meta = {
  /** v2 is a design preview: kept out of search so it doesn't compete with the live pages. */
  robots: { index: false, follow: false },
} as const;

export const heroV2 = {
  manifesto:
    'You write one brief. Creators across India shoot it their way, for followers who already trust them. Then you watch it land.',
  scroll: 'Scroll',
  statLabel: 'creators onboarding', // PLACEHOLDER: pairs with hero.stat (invented figure)
} as const;

export const howV2 = {
  stepOf: 'of',
} as const;

export const proofV2 = {
  hint: 'Swipe',
} as const;

