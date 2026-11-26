/**
 * Shared motion tokens. Every animation on the site reads from here so the
 * whole thing feels like one hand made it. CSS mirrors live in tokens.css.
 */
export const ease = {
  reveal: 'expo.out',
  transition: 'power3.inOut',
  soft: 'power2.out',
  linear: 'none',
  /** CSS equivalent of expo.out. */
  css: 'cubic-bezier(.16,1,.3,1)',
} as const;

export const dur = {
  micro: 0.25,
  reveal: 1.05,
  revealLong: 1.2,
  section: 1.4,
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.08,
  loose: 0.12,
} as const;

/** Media queries used with gsap.matchMedia(). */
export const mq = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

/** Default ScrollTrigger start for reveal-on-enter. */
export const revealStart = 'top 85%';

/** sessionStorage key: entrance sequence already played this session. */
export const ENTRANCE_KEY = 'ccc:entrance-played';

/** Framer Motion (motion) transition presets for UI state changes. */
export const uiSpring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;
export const uiEase = [0.16, 1, 0.3, 1] as const;

/**
 * Play-once ScrollTrigger behaviour. Used instead of `once: true`, which kills the
 * trigger mid-refresh and can corrupt ScrollTrigger's internal list when many
 * triggers are created in the same tick.
 */
export const playOnce = { toggleActions: 'play none none none' } as const;

/**
 * The entrance sequence plays only at or above this viewport width. Phones go straight
 * to the hero animation: the overlay costs ~2s of Speed Index on throttled mobile.
 * Set to 0 to play it everywhere.
 */
export const ENTRANCE_MIN_WIDTH = 768;
