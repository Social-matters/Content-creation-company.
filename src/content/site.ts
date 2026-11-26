import type { Cta, LinkItem } from './types';

export const site = {
  name: 'Content Creation Company',
  short: 'CCC',
  url: 'https://contentcreationcompany.in',
  description:
    "India's creator-commerce and AI-powered content marketplace. Brands brief once; vetted creators turn it into reels, UGC and shoot-day content that performs.",
  email: 'hello@contentcreationcompany.in',
  replyNote: 'We reply within 24 hours',
  credit: 'An Initiation by Social Matters',
  locale: 'en_IN',
} as const;

export const nav = {
  audience: [
    { label: 'Brands', href: '/' },
    { label: 'Creators', href: '/creators' },
  ],
  links: [
    { label: 'How it works', href: '/#how' },
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ] satisfies LinkItem[],
  creatorLinks: [
    { label: 'How you earn', href: '/creators#earn' },
    { label: 'Tiers', href: '/creators#tiers' },
    { label: 'FAQ', href: '/creators#faq' },
    { label: 'About', href: '/about' },
  ] satisfies LinkItem[],
  login: 'Log in',
  cta: { label: 'Start a campaign', modal: 'campaign' } satisfies Cta,
  creatorCta: { label: 'Join as a creator', modal: 'creator' } satisfies Cta,
  menu: 'Menu',
  close: 'Close',
  skip: 'Skip to content',
} as const;

export const socials = [
  // PLACEHOLDER: confirm handles before launch
  { label: 'Instagram', href: 'https://instagram.com/contentcreationcompany', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/contentcreationcompany', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://youtube.com/@contentcreationcompany', icon: 'youtube' },
  { label: 'X', href: 'https://x.com/ccc_india', icon: 'x' },
] as const;

export type SocialIcon = (typeof socials)[number]['icon'];

export const footer = {
  tagline: 'Brands brief once. Creators make it theirs. Everybody gets results.',
  columns: [
    {
      title: 'Brands',
      links: [
        { label: 'How it works', href: '/#how' },
        { label: 'Services', href: '/#services' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Start a campaign', href: '/start-a-campaign' },
      ],
    },
    {
      title: 'Creators',
      links: [
        { label: 'For creators', href: '/creators' },
        { label: 'How you earn', href: '/creators#earn' },
        { label: 'Follower tiers', href: '/creators#tiers' },
        { label: 'Apply', href: '/join-as-creator' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ] satisfies { title: string; links: LinkItem[] }[],
  socialTitle: 'Social',
  contactTitle: 'Say hello',
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ] satisfies LinkItem[],
  copyright: `© ${new Date().getFullYear()} Content Creation Company.`,
  wordmark: 'CCC.',
} as const;

export const entrance = {
  label: 'Content Creation Company',
  words: ['Briefing', 'Matching', 'Shooting', 'Posting'],
  ready: 'Results',
} as const;

export const notFound = {
  code: '404',
  title: ['This reel', "didn't post."],
  body: "The page you're after moved, never existed, or is still in the edit.",
  cta: { label: 'Back to home', href: '/' },
} as const;
