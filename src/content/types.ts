/** Shared content types. Copy lives in src/content/*.ts; components never hardcode text. */

/** A display headline. Each entry is one authored line; `accent` marks the highlighted word. */
export type HeadlineLine = string | { before?: string; accent: string; after?: string; style?: AccentStyle; /** Let a long highlighted phrase take two lines on phones. */ wrap?: boolean };
export type AccentStyle = 'block' | 'orange' | 'outline';
export type Headline = readonly HeadlineLine[];

export type Cta = { label: string; href?: string; modal?: 'campaign' | 'creator'; meta?: string; /** Read by screen readers after the label, to tell identical links apart. */ context?: string };

export type LinkItem = { label: string; href: string; external?: boolean };

export type MediaSlot = {
  /** mp4 for video slots; omitted for stills. */
  src?: string;
  /** webp poster / still. */
  poster: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
};
