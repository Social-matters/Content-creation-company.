import type { Headline } from './types';

export const about = {
  meta: { title: 'About', description: "Why we're building India's creator-commerce marketplace, and who's behind it." },
  hero: {
    badge: 'About CCC',
    headline: ['We build', 'the bridge.', { before: 'You ', accent: 'cross it.', style: 'block' }] satisfies Headline,
    lead: "Content Creation Company connects brands, creators, production and performance in one place, so good content stops being hard to get.",
  },
  problem: {
    label: '// Why we exist',
    headline: ['Brands need volume.', 'Creators need work.', { before: 'Nobody ', accent: 'connects them.', style: 'orange' }] satisfies Headline,
    paragraphs: [
      'Indian D2C brands, restaurants, salons and stores need a constant stream of social content. Hiring creators one by one is expensive, slow and full of fake-follower roulette.',
      'Meanwhile, thousands of talented creators are stuck in DM black holes, undercharging, or chasing brand deals through middlemen who keep 40% of the fee.',
      "We're building the marketplace that fixes both sides.",
    ],
  },
  principles: {
    label: '// How we work',
    headline: ['Four things', { before: 'we ', accent: "won't bend on.", style: 'orange' }] satisfies Headline,
    items: [
      { n: '01', title: 'Outcomes over posts', body: 'We measure what the content did, not how many pieces went out.' },
      { n: '02', title: 'Creators get paid fairly', body: 'Clear rates, on-time payouts, no hidden middleman cut.' },
      { n: '03', title: 'Honest numbers', body: 'Real reach from real audiences. Sample data is always labelled.' },
      { n: '04', title: 'India first', body: 'Built for Indian cities, languages and the way Indian brands actually sell.' },
    ],
  },
  backer: {
    label: '// The team behind it',
    title: 'An initiation by Social Matters.',
    body: 'CCC is incubated by Social Matters, bringing years of hands-on social and content work for Indian brands to a platform anyone can use.', // CONFIRM wording with Social Matters
  },
} as const;

/** The contact page is the application page: the heading and the forms under it. */
export const contact = {
  meta: { title: 'Join the network', description: 'Apply to join the Content Creation Company network, or send us a message. We reply within 24 hours.' },
  hero: {
    badge: 'We reply within 24 hours',
    headline: ['Apply to', { accent: 'join the network.', style: 'block', wrap: true }] satisfies Headline, // default heading, owner may change it
    lead: 'Tell us who you are and what you do. We reply within 24 hours.',
  },
  writeFirst: 'Questions first? Investors, partners, venues and press: same address.',
  tabsLabel: 'Pick your form',
} as const;
