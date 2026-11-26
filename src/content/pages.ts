import type { Cta, Headline } from './types';

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

export const contact = {
  meta: { title: 'Contact', description: 'Talk to Content Creation Company: brands, creators, investors, partners, venues and press.' },
  hero: {
    badge: 'We reply within 24 hours',
    headline: ['Want to talk', { before: 'before ', accent: 'applying?', style: 'block' }] satisfies Headline,
    lead: 'Drop us a line. Investors, partners, venues and press: same address.',
  },
  emailLabel: 'Email us',
  tabsLabel: 'Or apply directly',
  tabs: ["I'm a brand", "I'm a creator"] as const,
  cards: [
    { title: 'Brands', body: 'Founding-brand slots, pricing and Creator Visits.' },
    { title: 'Creators', body: 'Joining the network, briefs and payouts.' },
    { title: 'Everyone else', body: 'Investors, venues, partners and press.' },
  ],
} as const;

export const pricingPage = {
  meta: { title: 'Pricing', description: 'Self-serve or managed creator content, priced in ₹. Content Exhibition, Creator Visit, Pay-On-Performance and the AI Creator Marketplace.' },
  hero: {
    badge: 'Founding-brand pricing locked for year one',
    headline: ['Built like an agency.', { before: 'Priced like a ', accent: 'platform.', style: 'block' }] satisfies Headline,
    lead: 'Pick a plan, or a single offer. Every price is in rupees, and founding brands lock their rate for a year.',
  },
  faq: {
    label: '// Pricing FAQ',
    headline: ['The fine', { accent: 'print.', style: 'orange' }] satisfies Headline,
    // CONFIRM: answers need sign-off before launch
    items: [
      { q: 'Are prices inclusive of GST?', a: 'Prices shown exclude GST, which is added at the applicable rate on invoice.' },
      { q: 'What does the Pay-On-Performance success fee depend on?', a: 'Tiers are agreed upfront against view and engagement targets. You only pay the fee when a tier is hit.' },
      { q: 'Can I combine offers?', a: 'Yes. Many brands pair a Content Exhibition with Pay-On-Performance to scale what works.' },
      { q: 'What does "founding-brand pricing" mean?', a: 'Brands that sign before launch keep their rate for the first year, even if our prices go up.' },
    ],
  },
} as const;

export const applyPages = {
  brand: {
    badge: 'Founding-brand slots open',
    headline: ['Start a', { accent: 'campaign.', style: 'block' }] satisfies Headline,
    lead: 'Two minutes now saves weeks of DMs later.',
  },
  creator: {
    badge: 'Now onboarding creators',
    headline: ['Join as a', { accent: 'creator.', style: 'block' }] satisfies Headline,
    lead: 'Paid briefs that fit your audience. Contracts and payouts handled.',
  },
  back: { label: 'Back to home', href: '/' } satisfies Cta,
} as const;
