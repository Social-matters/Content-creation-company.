/**
 * Home copy. Influencer-led positioning: influencer marketing is the main story,
 * creator content (model shoots, creator shoots, exhibitions) the supporting one.
 * Every invented figure, handle or name is
 * marked PLACEHOLDER and listed in docs/TODO-real-content.md.
 */
import type { Cta, Headline, MediaSlot } from '../types';
import { assets } from '../assets';
import type { ServiceKey } from './forms';
import type { NotificationTone } from '@/components/sections/NotificationCard';
import { joinNetwork, messageHref } from '../site';

export const heroV2 = {
  badge: 'Now onboarding founding brands',
  headline: ['Influence.', 'Content.', { accent: 'Results.', style: 'block' }] satisfies Headline,
  sub: 'From micro-influencers to TV stars, with models and shoots on tap. One platform, one outcome.',
  ctas: [
    { label: 'Start a campaign', modal: 'campaign' },
    { label: 'Book a call', href: messageHref, meta: '15 min' },
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
    { m: 18, tag: 'Mid · Fitness' },
  ] as { m?: number; tag?: string; type?: 'Influencer' | 'TV Actor' | 'Model' }[],
} as const;

/** Quiet band near the end of the home page: the influencer / creator / model way in. */
export const joinBandV2 = {
  label: 'Influencer, creator or model?',
  title: 'Join our influencer network.',
  body: 'Paid briefs from brands that fit your audience. We handle contracts, payments and the follow-ups.',
  cta: joinNetwork,
} as const;

type ServiceCard = { key: ServiceKey; n: string; title: string; body: string; facts: string[]; badge: string | null; media: MediaSlot | null; more: Cta | null };
type CompactCard = { key: ServiceKey; title: string; body: string; facts: string[]; media: MediaSlot; more: Cta | null };

/**
 * Services. Influencer side first and large (stacked cards); creator content second and
 * compact. `split` labels the divider bar that shows the weighting without printing a ratio.
 */
export const servicesV2 = {
  id: 'services',
  label: '// What we run',
  headline: ['Influence,', { accent: 'at any scale.', style: 'orange' }] satisfies Headline,
  body: 'From a hundred nano-influencers to a TV star. Every option ends the same way: posts live, numbers on the board.',
  split: { primary: 'Influencer marketing', secondary: 'Creator content' },
  /** Every card ends with this instead of a price. */
  pricingLink: 'Contact for pricing',
  influencer: [
    {
      key: 'campaigns',
      n: '01',
      title: 'Influencer Campaigns',
      body: 'Nano to macro influencers, targeted by niche and city, with fixed deliverables agreed up front.',
      facts: ['Nano to macro', 'Niche + city targeting', 'Fixed deliverables'],
      badge: null,
      media: assets.mosaic[3],
      more: null,
    },
    {
      key: 'celebrity',
      n: '02',
      title: 'Celebrity & TV Serial Actor Tie-ups',
      body: 'Endorsements, appearances and branded content with celebrities and television serial actors.',
      facts: ['Endorsements', 'Appearances', 'Branded content'],
      badge: null,
      media: assets.sets[1], // set atmosphere only; licensed talent imagery to come
      more: { label: 'Celebrity tie-ups', href: '/celebrities' },
    },
    {
      key: 'performance',
      n: '03',
      title: 'Pay-On-Performance',
      body: 'Three videos built to perform, judged on the numbers they land.',
      facts: ['3 videos', 'Results-led'],
      badge: null,
      media: assets.categories.food,
      more: null,
    },
    {
      key: 'matching',
      n: '04',
      title: 'AI Influencer Matching',
      body: 'Enter a goal. AI matches influencers, drafts the brief and predicts performance before you book.',
      facts: ['AI matching', 'Auto briefs', 'Performance prediction'],
      badge: 'Live: try it now',
      media: assets.categories.beauty,
      more: null,
    },
  ] as ServiceCard[],
  creator: {
    id: 'model-shoots',
    label: '// Creator content',
    title: 'Need the content itself?',
    body: 'Models, creators and shoot days for the assets behind your campaigns.',
    items: [
      {
        key: 'model-shoots',
        title: 'Model Shoots',
        body: 'We provide the models and run the shoot: product, lookbook, e-commerce and campaign.',
        facts: ['Models provided', 'Studio or location'],
        media: assets.ctaBrand,
        more: { label: 'Model shoots', href: '/model-shoots' },
      },
      {
        key: 'visit',
        title: 'Creator Visit',
        body: 'A curated squad shoots at your café, salon, gym or showroom. One day on set, weeks of content.',
        facts: ['2–10 creators', 'At your location'],
        media: assets.categories.lifestyle,
        more: null,
      },
      {
        key: 'exhibition',
        title: 'Content Exhibition',
        body: "One venue, a rotating line-up of creators. You walk out with a quarter's worth of content in a single day.",
        facts: ['5–25 reels', 'One venue, one day'],
        media: assets.ctaCreator,
        more: null,
      },
    ] as CompactCard[],
  },
  ctas: [
    { label: 'Start a campaign', modal: 'campaign' },
    { label: 'Book a call', href: messageHref, meta: '15 min' },
  ] satisfies Cta[],
  rosterPlaceholder: 'Roster placeholder',
} as const;

/** How it works: Brief → Match → Approve → Live. Mock figures are illustrative. */
export const howV2 = {
  id: 'how',
  label: '// How it works',
  headline: ['From DM to deliverable', { before: 'in four ', accent: 'moves.', style: 'orange' }] satisfies Headline,
  stepOf: 'of',
  steps: [
    { key: 'brief', n: '01', title: 'Brief', body: 'Tell us the product, the audience and the cities. Two minutes, no deck.' },
    { key: 'match', n: '02', title: 'Match', body: 'AI shortlists influencers whose audience actually fits. Add a celebrity or a model shoot to the same brief.' },
    { key: 'approve', n: '03', title: 'Approve', body: 'Drafts, talent confirmations and shoot bookings land in one queue. Approve, or ask for a tweak.' },
    { key: 'live', n: '04', title: 'Live', body: 'Posts go out from real accounts. Watch the views land.' },
  ],
  chips: ['Brief sent', '12 influencers shortlisted', 'Celebrity request approved', '+120K views today'], // PLACEHOLDER figures mirror the mock
  mock: {
    brief: {
      title: 'New brief',
      status: 'Draft',
      fields: [
        { label: 'Product', value: 'Cold brew, 250 ml can' },
        { label: 'Audience', value: '18–30, metro cities' },
      ],
      needsLabel: 'You need',
      needs: ['Influencers', 'Celebrity', 'Model shoot'],
      citiesLabel: 'Cities',
      cities: ['Mumbai', 'Pune', 'Bengaluru'],
      countLabel: 'Influencers',
      count: 12,
      button: 'Send brief',
    },
    match: {
      title: 'Influencer shortlist',
      meta: '12 of 340 fit',
      accept: 'Accept',
      accepted: 'Accepted',
      engagement: 'ER',
      // PLACEHOLDER: illustrative profiles (abstract avatars, no real people)
      items: [
        { handle: '@ananya.styles', niche: 'Fashion · Mumbai', tier: 'Micro', followers: '48K', er: '5.2%' },
        { handle: '@rohan.eats', niche: 'Food · Pune', tier: 'Mid', followers: '112K', er: '4.1%' },
        { handle: '@meera.makes', niche: 'Lifestyle · Bengaluru', tier: 'Micro', followers: '23K', er: '6.8%' },
      ],
    },
    approve: {
      title: 'Approvals',
      meta: '3 items',
      // PLACEHOLDER: illustrative requests; no real celebrity or actor
      items: [
        { kind: 'Celebrity request', title: 'TV actor · story + reel', status: 'Confirmed', icon: 'star' },
        { kind: 'Model booking', title: '2 models · Sat, 10 am', status: 'Booked', icon: 'calendar' },
        { kind: 'Reel draft', title: '@ananya.styles · 30s', status: 'Approved', icon: 'play' },
      ],
    },
    live: {
      title: 'Views',
      live: 'Live',
      total: 1240000, // PLACEHOLDER: sample campaign
      today: '+120K today',
      caption: 'Sample campaign · 12 influencers · day 14',
      feed: [
        { handle: '@ananya.styles', text: 'posted a reel', value: '18.2K' },
        { handle: '@rohan.eats', text: 'story mention', value: '6.4K' },
        { handle: '@meera.makes', text: 'posted a reel', value: '31K' },
      ],
    },
  },
} as const;

export const marqueesV2 = {
  formats: ['Influencer campaigns', 'Celebrity tie-ups', 'Model shoots', 'Reels', 'Stories', 'UGC', 'AI matching', 'Pay on performance'],
  cities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'], // PLACEHOLDER: confirm launch cities
} as const;

export const operationsV2 = {
  label: '// The machine',
  headline: ['You brief.', { before: 'We run ', accent: 'the rest.', style: 'block' }] satisfies Headline,
  body: 'Everything between "we should do influencers" and "that reel did numbers" is our job.',
  items: [
    { n: '01', title: 'Shortlisting', body: 'Influencers scored for real audience and engagement, not follower count.', tag: 'Vetted' },
    { n: '02', title: 'Negotiation & contracts', body: 'Rates, usage rights and contracts agreed for you.', tag: 'Handled' },
    { n: '03', title: 'Briefing', body: 'Your goal turned into a brief influencers can follow.', tag: 'AI-drafted' },
    { n: '04', title: 'Content approval', body: 'Every draft checked against the brief before you see it.', tag: 'QC' },
    { n: '05', title: 'Posting schedule', body: 'Posts timed across accounts so the campaign lands together.', tag: 'Planned' },
    { n: '06', title: 'Tracking', body: 'Views, saves and shares pulled daily from every post.', tag: 'Daily' },
    { n: '07', title: 'Payments', body: 'Influencer payouts and GST invoices, handled.', tag: 'Paperwork' },
    { n: '08', title: 'Reporting', body: 'One weekly report with numbers that mean something.', tag: 'Weekly' },
  ],
} as const;

/** `roster`: set footage standing in for talent we can't show yet; tagged as a placeholder. */
type ProofItem = { media: MediaSlot | null; caption: string; roster?: boolean };

/**
 * Proof, grouped by talent type. Influencer tiles carry their category; celebrity tiles are
 * roster placeholders (no real celebrity imagery until licensed images are supplied).
 */
export const proofV2 = {
  id: 'proof',
  label: '// Proof by type',
  headline: ['Feeds, faces', { before: 'and ', accent: 'sets.', style: 'orange' }] satisfies Headline,
  body: 'Influencer reels, celebrity and actor tie-ups, and model shoots. The kind of content each one gets.',
  hint: 'Swipe',
  jumpLabel: 'Jump to',
  rosterPlaceholder: 'Roster placeholder',
  groups: [
    {
      key: 'influencers',
      title: 'Influencers',
      line: 'Reels, stories and live drops from accounts people already follow.',
      categories: ['Food & Beverage', 'Fashion', 'Beauty & Skincare', 'Fitness', 'Lifestyle', 'Travel', 'Tech & Gadgets', 'Home & Decor'],
      items: [
        { media: assets.categories.food, caption: 'Food & Beverage' },
        { media: assets.categories.fashion, caption: 'Fashion' },
        { media: assets.categories.beauty, caption: 'Beauty & Skincare' },
        { media: assets.categories.fitness, caption: 'Fitness' },
        { media: assets.categories.lifestyle, caption: 'Lifestyle' },
        { media: assets.categories.travel, caption: 'Travel' },
      ] as ProofItem[],
    },
    {
      key: 'celebrities',
      title: 'Celebrities & actors',
      line: 'Endorsements, appearances and branded content. Roster shared on request.',
      categories: [] as string[],
      items: [
        { media: assets.sets[0], caption: 'Celebrity endorsement', roster: true },
        { media: assets.sets[1], caption: 'TV serial actor', roster: true },
      ] as ProofItem[],
    },
    {
      key: 'models',
      title: 'Model shoots',
      line: 'Lookbook, e-commerce and campaign shoots, models provided.',
      categories: [] as string[],
      items: [
        { media: assets.models[0], caption: 'Studio campaign shoot' },
        { media: assets.models[1], caption: 'Lookbook' },
        { media: assets.mosaic[1], caption: 'Jewellery shoot' },
      ] as ProofItem[],
    },
  ],
} as const;

/**
 * CCC vs DIY influencer outreach (the agency column is gone in v2). Values may be prefixed
 * "yes:" / "no:" for a mark. The last row says honestly where DIY is the better choice.
 */
export const comparisonV2 = {
  label: '// How we compare',
  headline: ['Skip the DMs.', { before: 'Skip the ', accent: 'guesswork.', style: 'orange' }] satisfies Headline,
  body: "The honest version: where we win, and where you'd still pick the alternative.",
  columns: ['Content Creation Company', 'DIY influencer outreach'],
  // CONFIRM: every claim in the CCC column needs sign-off before launch
  rows: [
    { label: 'Pricing model', values: ['Flat per package + optional performance fee', 'Per-influencer negotiation'] },
    { label: 'Influencer verification', values: ['yes:AI-scored, audience-quality vetted', 'no:You guess'] },
    { label: 'Celebrities & TV actors', values: ['yes:Arranged for you', 'no:Cold DMs and managers'] },
    { label: 'Models & shoot crew', values: ['yes:Provided', 'no:You hire and coordinate'] },
    { label: 'AI brief + matching', values: ['yes:Built in', 'no:None'] },
    { label: 'Pay-on-performance', values: ['yes:Available', 'no:Rarely'] },
    { label: 'Contracts, payments, reporting', values: ['yes:Handled', 'no:Manual follow-ups'] },
    { label: 'Best for', values: ['Brands that need volume and speed', 'A one-off collab with an influencer you already know'] },
  ],
};

export const statsV2 = {
  label: '// Early numbers',
  headline: ['Small start.', { accent: 'Big intent.', style: 'orange' }] satisfies Headline,
  sampleTag: 'Sample figures · replace before launch',
  // PLACEHOLDER: every figure below is invented
  items: [
    { value: 2400, suffix: '+', label: 'Influencers onboarded' },
    { value: 25, suffix: '+', label: 'Celebrities & actors on roster' },
    { value: 40, suffix: '+', label: 'Shoots delivered' },
    { value: 6, suffix: '', label: 'Cities' },
  ],
} as const;

export const testimonialsV2 = {
  label: '// Word on the street',
  headline: ['Heard from', { accent: 'early users.', style: 'orange' }] satisfies Headline,
  sampleTag: 'Sample quote · replace before launch',
  // PLACEHOLDER: invented sample quotes. Replace with real, attributable testimonials.
  items: [
    { quote: 'Our shortlist came back in a day, and every influencer on it actually matched our buyers.', name: 'Founder', role: 'D2C skincare brand, Mumbai', initials: 'SB' },
    { quote: 'The briefs are clear, payments land on time, and I only get brands that fit my audience.', name: 'Lifestyle influencer', role: '48K followers, Bengaluru', initials: 'LI' },
    { quote: 'Pay-on-performance made it an easy yes for our CFO. We only paid more when the reels actually worked.', name: 'Marketing lead', role: 'Food brand, Delhi', initials: 'FB' },
  ],
} as const;

/** Client logos (files and names: clients.ts, generated by `pnpm logos`). */
export const clientsV2 = {
  // CONFIRM: the relationship this heading states, and each brand's permission to show its logo
  title: "Brands we've worked with",
  label: '// Brands',
  openSlot: { label: 'Your brand next', modal: 'campaign' } satisfies Cta,
} as const;

/** Closing call at the end of the home page. */
export const finaleV2 = {
  headline: ['Your feed', "won't fill", { accent: 'itself.', style: 'block' }] satisfies Headline,
  body: 'Founding-brand slots are open. Priority slots, first pick of campaigns, and a direct line to the team.',
  ctas: [
    { label: 'Start a campaign', modal: 'campaign' },
    { label: 'Book a call', href: messageHref, meta: '15 min' },
  ] satisfies Cta[],
} as const;

/** Creator card on the About page. */
export const creatorCtaV2 = {
  label: 'Creator?',
  headline: ['Make reels.', { before: 'Get ', accent: 'paid.', style: 'orange' }] satisfies Headline,
  body: 'Real briefs from real brands, sent to you. We handle contracts, payments and the awkward follow-ups.',
  note: 'No minimum follower count.', // CONFIRM with CCC before launch (see docs/TODO-real-content.md)
  cta: { label: 'Join as a creator', modal: 'creator' } satisfies Cta,
} as const;
