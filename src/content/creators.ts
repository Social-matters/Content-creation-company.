import type { Cta, Headline } from './types';

export const creatorsMeta = {
  title: 'For creators',
  description: 'Get paid briefs from brands that fit your audience. Contracts, payments and follow-ups handled by Content Creation Company.',
} as const;

export const creatorsHero = {
  badge: 'Now onboarding creators',
  headline: ['You create.', 'We bring', { accent: 'the brands.', style: 'block' }] satisfies Headline,
  lead: 'Paid briefs from brands that actually fit your audience. You make the reel; we handle contracts, payments and the chasing.',
  ctas: [
    { label: 'Join as a creator', modal: 'creator' },
    { label: 'How you earn', href: '#earn' },
  ] satisfies Cta[],
  notifications: [
    // PLACEHOLDER: illustrative amounts and brands
    { app: 'CCC', time: 'now', text: 'Payout sent: ₹8,500', tone: 'ccc' },
    { app: 'CCC Match', time: '4m', text: 'New brief: café launch, Pune', tone: 'match' },
  ],
} as const;

export const earn = {
  id: 'earn',
  label: '// How you earn',
  headline: ['Four steps.', { before: 'Zero ', accent: 'chasing.', style: 'orange' }] satisfies Headline,
  steps: [
    { n: '01', title: 'Apply once', body: 'Tell us your niche, city and languages. We review every profile by hand.' },
    { n: '02', title: 'Get matched', body: 'Briefs that fit your audience land in your inbox. Say yes to the ones you like.' },
    { n: '03', title: 'Shoot and post', body: 'Make it your way, from your account. A clear brief means fewer revisions.' },
    { n: '04', title: 'Get paid', body: 'Payment goes out after approval. Performance bonuses on top when reels pop.' }, // CONFIRM payout timing/bonus terms
  ],
} as const;

export const categoriesIntro = {
  label: '// What brands are briefing',
  headline: ['Your niche,', { accent: 'covered.', style: 'orange' }] satisfies Headline,
  body: 'Eight categories at launch, with briefs for every kind of feed.',
} as const;

export const tiers = {
  id: 'tiers',
  label: '// Follower tiers',
  headline: ['Every size', { before: 'gets ', accent: 'work.', style: 'block' }] satisfies Headline,
  body: 'Brands brief by fit, not just follower count. Here is how the network is grouped.',
  items: [
    { name: 'Nano', range: 'Under 10K', body: 'Hyperlocal briefs, product seeding and UGC that brands run as ads.', formats: ['UGC', 'Seeding', 'Store visits'] },
    { name: 'Micro', range: '10K – 100K', body: 'The sweet spot for niche launches and content exhibitions.', formats: ['Reels', 'Exhibitions', 'Creator Visits'] },
    { name: 'Mid', range: '100K – 500K', body: 'City-wide launches and multi-post campaigns with performance bonuses.', formats: ['Campaigns', 'Pay-on-performance'] },
    { name: 'Macro', range: '500K+', body: 'Hero moments, brand days and launches that anchor a campaign.', formats: ['Hero reels', 'Brand days'] },
  ],
} as const;

export const handled = {
  label: '// What we handle',
  headline: ['You make content.', { before: 'We do ', accent: 'the admin.', style: 'block' }] satisfies Headline,
  items: [
    { title: 'Briefs that make sense', body: 'Clear goals, references and do-nots. No guessing what the brand wants.', icon: 'doc' },
    { title: 'Contracts', body: 'Usage rights and deliverables in writing before you shoot.', icon: 'lock' },
    { title: 'Payments', body: 'Invoices and payouts handled. No more following up for weeks.', icon: 'bolt' },
    { title: 'Brand fit', body: 'We only send briefs that suit your audience and your voice.', icon: 'heart' },
  ],
} as const;

export const creatorFaq = {
  id: 'faq',
  label: '// FAQ',
  headline: ['Questions,', { accent: 'answered.', style: 'orange' }] satisfies Headline,
  // CONFIRM: every answer below needs sign-off before launch
  items: [
    { q: 'Do I need a minimum follower count?', a: 'No. Brands brief by audience fit and content quality, so nano creators get work too.' },
    { q: 'How and when do I get paid?', a: 'Payment is released after the brand approves your post. We handle invoicing; you get a bank transfer.' },
    { q: 'Which cities are you starting in?', a: 'We are launching in major Indian metros first and adding cities as brands come on board. Apply from anywhere; we will match you when briefs open near you.' },
    { q: 'Do I post from my own account?', a: 'Yes. That is the point: your audience, your voice. Some briefs are UGC-only, where the brand posts.' },
    { q: 'Can I turn down a brief?', a: 'Always. You only take the briefs you want.' },
  ],
} as const;

export const creatorApply = {
  label: '// Apply',
  headline: ['Ready when', { accent: 'you are.', style: 'block' }] satisfies Headline,
  body: 'Takes two minutes. We review every application by hand and reply within 24 hours.',
} as const;
