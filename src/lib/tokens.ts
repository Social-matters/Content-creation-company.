/**
 * CCC design tokens (TypeScript mirror of src/styles/tokens.css).
 * Platform-agnostic on purpose: the Phase 3 React Native app imports this file.
 */
export const colors = {
  orange: '#FF812A',
  orangeDeep: '#E8661A',
  /** Orange for text on light backgrounds (WCAG AA). */
  orangeText: '#B34A0B',
  orangeDisplay: '#D4570F',
  black: '#000000',
  ink: '#141210',
  ink2: '#1D1A17',
  ink3: '#2A2623',
  cream: '#F1EDE4',
  cream2: '#E7E1D5',
  stone: '#C4BFB8',
  stoneDark: '#8A847C',
  white: '#FFFFFF',
} as const;

export const fonts = {
  display: 'Archivo Black',
  body: 'Bricolage Grotesque',
  mono: 'JetBrains Mono',
} as const;

/** Radii in px. */
export const radii = { sm: 12, md: 20, lg: 28, xl: 36, pill: 999 } as const;

/** Hard offset shadows (neo-brutalist), in px. */
export const shadows = {
  hardSm: { x: 3, y: 3, color: colors.black },
  hard: { x: 5, y: 5, color: colors.black },
  hardLg: { x: 8, y: 8, color: colors.black },
} as const;

export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1440 } as const;

export type ColorToken = keyof typeof colors;
