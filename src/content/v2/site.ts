/** v2 site-wide copy: meta, nav, footer. v1's lives in ../site.ts. */

export const v2Meta = {
  /** v2 is a design preview: kept out of search so it doesn't compete with the live pages. */
  robots: { index: false, follow: false },
} as const;
