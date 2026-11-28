/**
 * v2 home copy (/v2). Influencer-led positioning: influencer marketing is the main story,
 * creator content (model shoots, creator shoots, exhibitions) the supporting one.
 * v1 copy lives in ../home.ts and is untouched. Every invented figure, handle or name is
 * marked PLACEHOLDER and listed in docs/TODO-real-content.md.
 */
import type { Cta, Headline } from '../types';
import type { NotificationTone } from '@/components/sections/NotificationCard';
import { joinNetwork } from './site';

export const heroV2 = {
  badge: 'Now onboarding founding brands',
  headline: ['Influence.', 'Content.', { accent: 'Results.', style: 'block' }] satisfies Headline,
  sub: 'From micro-influencers to TV stars, with models and shoots on tap. One platform, one outcome.',
  ctas: [
    { label: 'Start a campaign', modal: 'campaign' },
    { label: 'Book a call', href: '/contact', meta: '15 min' },
  ] satisfies Cta[],
  stat: { value: 2400, suffix: '+', label: 'influencers onboarding' }, // PLACEHOLDER: invented figure
  // PLACEHOLDER: illustrative activity; handles are invented
  notifications: [
    { app: 'Instagram', time: 'now', text: '@ananya.styles posted your reel', tone: 'ig' },
    { app: 'CCC', time: '2m', text: '+120K views in the last hour', tone: 'ccc' },
    { app: 'CCC Talent', time: '8m', text: 'Celebrity tie-up confirmed', tone: 'star' },
    { app: 'CCC Shoots', time: '14m', text: 'Shoot booked for Saturday', tone: 'shoot' },
  ] satisfies { app: string; time: string; text: string; tone: NotificationTone }[],
  manifesto:
    'You write one brief. Influencers across India post it their way, for followers who already trust them. Then you watch it land.',
  scroll: 'Scroll',
} as const;

/**
 * Influencer mosaic: 20 tiles. `m` indexes assets.mosaic; `tag` is tier · niche; `type` labels a
 * tile by talent type. The TV Actor tile is a stylised roster placeholder (no real person).
 */
export const mosaicV2 = {
  id: 'influencers',
  label: '// The influencer network',
  headline: ['Brief once.', 'Watch it', { accent: 'multiply.', style: 'orange' }] satisfies Headline,
  body: 'Nano to macro, across Mumbai, Delhi, Bengaluru and Hyderabad. Influencers post your brief their way, for their own followers, in their own language.', // PLACEHOLDER: confirm launch cities
  hoverLabel: 'Play',
  rosterPlaceholder: 'Roster placeholder',
  // PLACEHOLDER: tier and niche labels are illustrative (stock footage)
  tiles: [
    { m: 0, tag: 'Micro · Food' },
    { m: 1, type: 'Model' },
    { m: 2, tag: 'Nano · Lifestyle' },
    { m: 3, tag: 'Mid · Beauty' },
    { m: 7, type: 'Influencer' },
    { m: 5, tag: 'Micro · Fashion' },
    { m: 6, tag: 'Mid · Travel' },
    { m: 4, tag: 'Macro · Lifestyle' },
    { m: 8, tag: 'Micro · Beauty' },
    { type: 'TV Actor' },
    { m: 10, tag: 'Mid · Skincare' },
    { m: 11, tag: 'Micro · Lifestyle' },
    { m: 12, tag: 'Nano · Vlogs' },
    { m: 13, tag: 'Mid · Fashion' },
    { m: 14, tag: 'Micro · Tech' },
    { m: 15, tag: 'Macro · Entertainment' },
    { m: 16, tag: 'Micro · Fashion' },
    { m: 17, tag: 'Mid · Education' },
    { m: 9, tag: 'Nano · Beauty' },
    { m: 19, tag: 'Mid · Fitness' },
  ] as { m?: number; tag?: string; type?: 'Influencer' | 'TV Actor' | 'Model' }[],
} as const;

export const howV2 = {
  stepOf: 'of',
} as const;

export const proofV2 = {
  hint: 'Swipe',
} as const;

/** Quiet band near the end of the home page: the influencer / creator / model way in. */
export const joinBandV2 = {
  label: 'Influencer, creator or model?',
  title: 'Join our influencer network.',
  body: 'Paid briefs from brands that fit your audience. We handle contracts, payments and the follow-ups.',
  cta: joinNetwork,
} as const;
