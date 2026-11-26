import type { CategoryKey } from './assets';
import type { Cta, Headline } from './types';

export const hero = {
  badge: 'Now onboarding founding brands',
  headline: ['Creators.', 'Content.', { accent: 'Results.', style: 'block' }] satisfies Headline,
  sub: 'One platform, one outcome.',
  lead: "India's creator-commerce marketplace. You brief once; vetted creators turn it into reels that sell.",
  ctas: [
    { label: 'Start a campaign', modal: 'campaign' },
    { label: 'Book a call', href: '/contact', meta: '15 min' },
  ] satisfies Cta[],
  creatorLink: { prefix: 'Creator?', label: 'Join as a creator', href: '/creators' },
  stat: { value: 2400, suffix: '+', label: 'creators onboarding' }, // PLACEHOLDER
  notifications: [
    // PLACEHOLDER: handles are illustrative
    { app: 'Instagram', time: 'now', text: '@priya.eats posted your reel', tone: 'ig' },
    { app: 'CCC', time: '2m', text: '+12K views in the last hour', tone: 'ccc' },
    { app: 'CCC Match', time: '5m', text: 'New brief matched in 2 min', tone: 'match' },
  ],
} as const;

export const mosaic = {
  label: '// One brief, many feeds',
  headline: ['Write it once.', 'Watch it', { accent: 'multiply.', style: 'orange' }] satisfies Headline,
  body: 'Send one brief. Creators across Mumbai, Delhi, Bengaluru and Hyderabad shoot it their way, for their own followers, in their own language.', // PLACEHOLDER: confirm launch cities
  hoverLabel: 'Play',
} as const;

export const howItWorks = {
  id: 'how',
  label: '// How it works',
  headline: ['From DM to deliverable', { before: 'in four ', accent: 'moves.', style: 'orange' }] satisfies Headline,
  steps: [
    { key: 'brief', n: '01', title: 'Brief', body: 'Tell us the product, the city and the vibe. Two minutes, no deck.' },
    { key: 'match', n: '02', title: 'Match', body: 'AI shortlists creators whose audience actually fits. You tap accept.' },
    { key: 'review', n: '03', title: 'Review', body: 'Drafts land in one queue. Approve, or ask for a tweak.' },
    { key: 'live', n: '04', title: 'Live', body: 'Reels go out from real accounts. Watch the views land.' },
  ],
  chips: ['Brief sent', '12 creators matched', '4 of 4 approved', '+86K views today'], // PLACEHOLDER figures mirror the mock
  mock: {
    brief: {
      title: 'New brief',
      status: 'Draft',
      fields: [
        { label: 'Product', value: 'Cold brew, 250 ml can' },
        { label: 'Goal', value: 'Launch buzz in two cities' },
      ],
      citiesLabel: 'Cities',
      cities: ['Mumbai', 'Pune', 'Bengaluru'],
      formatsLabel: 'Formats',
      formats: ['Reels', 'Shorts', 'Stories'],
      creatorsLabel: 'Creators',
      creators: 12,
      button: 'Send brief',
    },
    match: {
      title: 'Matched creators',
      meta: '12 of 340 fit',
      accept: 'Accept',
      accepted: 'Accepted',
      // PLACEHOLDER: illustrative creator profiles (abstract avatars, no real people)
      creators: [
        { handle: '@ananya.brews', niche: 'Food · Mumbai', followers: '48K', fit: 96 },
        { handle: '@rohan.daily', niche: 'Lifestyle · Pune', followers: '112K', fit: 92 },
        { handle: '@meera.makes', niche: 'Food · Bengaluru', followers: '23K', fit: 89 },
      ],
    },
    review: {
      title: 'Review queue',
      meta: '4 drafts',
      approve: 'Approve',
      approved: 'Approved',
    },
    live: {
      title: 'Views',
      live: 'Live',
      total: 1240000, // PLACEHOLDER: sample campaign
      today: '+86K today',
      caption: 'Sample campaign · 12 creators · day 14',
      feed: [
        { handle: '@ananya.brews', text: 'posted a reel', time: 'now', value: '18.2K' },
        { handle: '@rohan.daily', text: 'story mention', time: '3m', value: '6.4K' },
        { handle: '@meera.makes', text: 'posted a reel', time: '9m', value: '31K' },
      ],
    },
  },
} as const;

export const services = {
  id: 'services',
  label: "// What we run",
  headline: ['Four ways to', { accent: 'work with us.', style: 'orange' }] satisfies Headline,
  body: 'Pick the one that fits, or stack them. Every option ends the same way: content in hand, numbers on the board.',
  items: [
    {
      key: 'exhibition',
      n: '01',
      title: 'Content Exhibition',
      body: "One venue. 30 to 50 creators rotating through. You walk out with a quarter's worth of content in a single day.",
      price: 'From ₹75,000',
      priceNote: 'per brand',
      facts: ['30–50 creators', '5–25 reels'],
      badge: null,
    },
    {
      key: 'visit',
      n: '02',
      title: 'Creator Visit',
      body: 'A curated squad shoots at your café, salon, gym or showroom. One day on set, weeks of content.',
      price: '₹25K – ₹1L',
      priceNote: 'per visit',
      facts: ['2–10 creators', 'On your location'],
      badge: null,
    },
    {
      key: 'performance',
      n: '03',
      title: 'Pay-On-Performance',
      body: 'Three videos built to perform. A tiered success fee kicks in only when the numbers land.',
      price: '₹10K',
      priceNote: 'setup',
      facts: ['3 videos', 'Tiered success fee'],
      badge: null,
    },
    {
      key: 'marketplace',
      n: '04',
      title: 'AI Creator Marketplace',
      body: 'Enter a goal. AI matches creators, drafts the brief and predicts performance before you book.',
      price: 'Self-serve',
      priceNote: 'pay per creator',
      facts: ['AI matching', 'Auto briefs', 'Performance prediction'],
      badge: 'Live',
    },
  ],
  cta: { label: 'See pricing', href: '/pricing' } satisfies Cta,
} as const;

export const marquees = {
  formats: ['Reels', 'UGC', 'Brand days', 'Shoots', 'AI matching', 'Performance', 'Creators'],
  cities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'], // PLACEHOLDER: confirm launch cities
} as const;

export const operations = {
  label: '// The machine',
  headline: ['You brief.', { before: 'We run ', accent: 'the rest.', style: 'block' }] satisfies Headline,
  body: 'Everything between "we should do creators" and "that reel did numbers" is our job.',
  items: [
    { n: '01', title: 'Sourcing', body: 'Creators scored for real audience, not follower count.', tag: 'Vetted' },
    { n: '02', title: 'Briefing', body: 'Your goal turned into a shot list creators can follow.', tag: 'AI-drafted' },
    { n: '03', title: 'Review', body: 'Every draft checked against the brief before you see it.', tag: 'QC' },
    { n: '04', title: 'Tracking', body: 'Views, saves and shares pulled daily from every post.', tag: 'Daily' },
    { n: '05', title: 'Cutting', body: 'Angles that underperform get dropped by week two.', tag: 'Ruthless' },
    { n: '06', title: 'Replacing', body: 'Creator drops out? Someone just as good steps in.', tag: 'No gaps' },
    { n: '07', title: 'Payments', body: 'Contracts, GST invoices and payouts, handled.', tag: 'Paperwork' },
    { n: '08', title: 'Reporting', body: 'One weekly report with numbers that mean something.', tag: 'Weekly' },
  ],
} as const;

export const comparison = {
  label: '// How we compare',
  headline: ['Built like an agency.', { before: 'Priced like a ', accent: 'platform.', style: 'orange' }] satisfies Headline,
  body: "The honest version: where we win, and where you'd still pick the alternative.",
  columns: ['Content Creation Company', 'Traditional agency', 'DIY influencer outreach'],
  rows: [
    { label: 'Pricing model', values: ['Flat per package + optional performance fee', 'Retainer + project quote', 'Per-creator negotiation'] },
    { label: 'Creator verification', values: ['yes:AI-scored, audience-quality vetted', 'partial:Varies by agency', 'no:You guess'] },
    { label: 'Volume per shoot day', values: ['8–25 content pieces', '3–6 pieces', '1–3 pieces per creator'] },
    { label: 'AI brief + matching', values: ['yes:Built in', 'no:', 'no:'] },
    { label: 'Pay-on-performance', values: ['yes:Available', 'no:', 'no:'] },
    { label: 'End-to-end production', values: ['yes:Crew, edit, delivery handled', 'yes:', 'no:Creator handles it, quality varies'] },
    { label: 'Best for', values: ['Brands that need volume and speed', 'Hero campaigns, big budgets', 'One-off creator collabs'] },
  ],
} as const;

export const proof = {
  id: 'categories',
  label: '// Proof by category',
  headline: ['From plates', { before: 'to ', accent: 'playlists.', style: 'orange' }] satisfies Headline,
  body: "Eight categories at launch. Here's the kind of content each one gets.",
  items: [
    { key: 'food', title: 'Food & Beverage', line: 'Sizzle shots, first bites, menu drops.' },
    { key: 'fashion', title: 'Fashion', line: 'Try-ons, fit checks, festive edits.' },
    { key: 'beauty', title: 'Beauty & Skincare', line: 'Routines, swatches, honest reviews.' },
    { key: 'fitness', title: 'Fitness', line: 'Workouts, gear tests, transformation diaries.' },
    { key: 'lifestyle', title: 'Lifestyle', line: 'Day-in-the-life, trends, friend-group chaos.' },
    { key: 'travel', title: 'Travel', line: 'Stay tours, hidden spots, itinerary reels.' },
    { key: 'tech', title: 'Tech & Gadgets', line: 'Unboxings, setups, first impressions.' },
    { key: 'home', title: 'Home & Decor', line: 'Room makeovers, hauls, before-and-afters.' },
  ] satisfies { key: CategoryKey; title: string; line: string }[],
  hoverLabel: 'Play',
} as const;

export const stats = {
  label: '// Early numbers',
  headline: ['Small start.', { accent: 'Big intent.', style: 'orange' }] satisfies Headline,
  items: [
    { value: 2400, suffix: '+', label: 'Creators onboarding' }, // PLACEHOLDER
    { value: 8, suffix: '', label: 'Categories covered' },
    { value: 4, suffix: '', label: 'Revenue models live' }, // PLACEHOLDER: confirm
    { value: 6, suffix: '', label: 'Cities at launch' }, // PLACEHOLDER
  ],
  slotsLabel: '// Founding brand slots',
  slotsTitle: 'Your logo goes here.',
  slotsBody: 'We are signing a small group of founding brands. Locked pricing, first dibs on dates.',
  slotsTotal: 12, // PLACEHOLDER
  slotsTaken: 5, // PLACEHOLDER
  slotText: 'Your brand',
  slotsTakenText: 'Reserved',
} as const;

export const testimonials = {
  label: '// Word on the street',
  headline: ['Heard from', { accent: 'early users.', style: 'orange' }] satisfies Headline,
  sampleTag: 'Sample quote · replace before launch',
  // PLACEHOLDER: invented sample quotes. Replace with real, attributable testimonials.
  items: [
    {
      quote: 'We got more usable content from one exhibition day than from three months of chasing creators on DM.',
      name: 'Founder',
      role: 'D2C coffee brand, Mumbai',
      initials: 'CB',
    },
    {
      quote: 'The briefs are clear, payments land on time, and I only get brands that fit my audience.',
      name: 'Food creator',
      role: '48K followers, Bengaluru',
      initials: 'FC',
    },
    {
      quote: 'Pay-on-performance made it an easy yes for our CFO. We only paid more when the reels actually worked.',
      name: 'Marketing lead',
      role: 'Skincare brand, Delhi',
      initials: 'SK',
    },
  ],
} as const;

export const plans = {
  id: 'pricing',
  label: '// Plans',
  headline: ['You run it.', { before: 'Or ', accent: 'we do.', style: 'block' }] satisfies Headline,
  srTitle: 'Plans',
  toggle: ['Self-serve', 'Managed'] as const,
  items: {
    'Self-serve': {
      name: 'Self-serve',
      tagline: 'For teams who want the controls.',
      price: 'Pay per creator',
      priceNote: 'No retainer. Credits from ₹10K.', // PLACEHOLDER: confirm
      features: ['AI creator matching', 'Auto-drafted briefs', 'Performance prediction', 'In-app approvals', 'Creator payouts handled'],
      cta: { label: 'Start a campaign', modal: 'campaign' } satisfies Cta,
      popular: true,
    },
    Managed: {
      name: 'Managed',
      tagline: 'For teams who want it done.',
      price: 'From ₹25K',
      priceNote: 'Per visit or exhibition slot.',
      features: ['Dedicated campaign manager', 'Creator Visit or Content Exhibition', 'Shoot crew, edit and delivery', 'Pay-on-performance option', 'Weekly reporting'],
      cta: { label: 'Book a call', href: '/contact' } satisfies Cta,
      popular: false,
    },
  },
  popularLabel: 'Most picked',
} as const;

export const perks = {
  label: '// Apply for early access',
  headline: ['Be among', { accent: 'the first.', style: 'block' }] satisfies Headline,
  body: 'Founding brands and early-network creators get perks that stay with them.',
  items: [
    { title: 'Locked pricing', body: 'Founding-brand rates are fixed for your first year, whatever we charge later.', icon: 'lock' },
    { title: 'Priority slots', body: 'First dibs on exhibition dates and creator squads in your city.', icon: 'bolt' },
    { title: 'First pick of campaigns', body: 'Early creators see paid briefs before the rest of the network does.', icon: 'star' },
  ],
  ctas: [
    { label: 'Apply as a brand', modal: 'campaign' },
    { label: 'Apply as a creator', modal: 'creator' },
  ] satisfies Cta[],
} as const;

export const brandCta = {
  headline: ['Your feed', "won't fill", { accent: 'itself.', style: 'block' }] satisfies Headline,
  body: 'Founding-brand slots are open. Lock your pricing before launch.',
  ctas: [
    { label: 'Start a campaign', modal: 'campaign' },
    { label: 'Book a call', href: '/contact', meta: '15 min' },
  ] satisfies Cta[],
} as const;

export const creatorCta = {
  label: 'Creator?',
  headline: ['Make reels.', { before: 'Get ', accent: 'paid.', style: 'orange' }] satisfies Headline,
  body: 'Real briefs from real brands, sent to you. We handle contracts, payments and the awkward follow-ups.',
  note: 'No minimum follower count.', // CONFIRM with CCC before launch (see docs/TODO-real-content.md)
  ctas: [
    { label: 'Join as a creator', modal: 'creator' },
    { label: 'See how you earn', href: '/creators#earn' },
  ] satisfies Cta[],
} as const;
