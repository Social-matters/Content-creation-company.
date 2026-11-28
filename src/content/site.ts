import type { Cta, LinkItem } from './types';

export const site = {
  name: 'Content Creation Company',
  short: 'CCC',
  url: 'https://contentcreationcompany.in',
  description:
    'Influencer marketing in India, with creator content to match: influencer campaigns, celebrity and TV serial actor tie-ups and model shoots, run end to end.',
  email: 'hello@contentcreationcompany.in',
  replyNote: 'We reply within 24 hours',
  credit: 'An Initiation by Social Matters',
  locale: 'en_IN',
} as const;

/** The one place people apply: the top of the contact page. Every apply link points here. */
export const joinSection = { id: 'join-the-network', href: '/contact#join-the-network' } as const;
/** The brand form with this service's need pre-ticked. */
export const serviceEnquiryHref = (service: string) => `/contact?service=${service}#${joinSection.id}`;
/** Same place with the message form open, for people who want to talk rather than apply. */
export const messageHref = '/contact?apply=message#join-the-network';

/** One brand-facing nav. Influencers join through the footer and the band on the home page. */
export const nav = {
  links: [
    { label: 'Influencers', href: '/#influencers' },
    { label: 'Celebrities', href: '/celebrities' },
    { label: 'Model Shoots', href: '/model-shoots' },
    { label: 'How it works', href: '/#how' },
  ] satisfies LinkItem[],
  cta: { label: 'Join the network', href: joinSection.href } satisfies Cta,
  menu: 'Menu',
  close: 'Close',
  skip: 'Skip to content',
} as const;

export const joinNetwork = { label: 'Join our influencer network', modal: 'creator' } satisfies Cta;

export const socials = [
  // PLACEHOLDER: confirm handles before launch
  { label: 'Instagram', href: 'https://instagram.com/contentcreationcompany', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/contentcreationcompany', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://youtube.com/@contentcreationcompany', icon: 'youtube' },
  { label: 'X', href: 'https://x.com/ccc_india', icon: 'x' },
] as const;

export type SocialIcon = (typeof socials)[number]['icon'];

export const footer = {
  tagline: 'Influencer campaigns, celebrity tie-ups and model shoots, run end to end. One platform, one outcome.',
  columns: [
    {
      title: 'Services',
      links: [
        { label: 'Influencer campaigns', href: '/#services' },
        { label: 'Celebrity tie-ups', href: '/celebrities' },
        { label: 'Model shoots', href: '/model-shoots' },
        { label: 'How it works', href: '/#how' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: messageHref },
        { label: 'Start a campaign', href: '/contact?apply=brand#join-the-network' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ] satisfies { title: string; links: LinkItem[] }[],
  join: joinNetwork,
  socialTitle: 'Social',
  contactTitle: 'Say hello',
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ] satisfies LinkItem[],
  copyright: "© 2026 Content Creation Company.", // update yearly (literal avoids server/client year mismatch)
  wordmark: 'CCC.',
} as const;

export const entrance = {
  label: 'Content Creation Company',
  words: ['Briefing', 'Matching', 'Shooting', 'Posting'],
  ready: 'Results',
} as const;

export const notFound = {
  code: '404',
  title: ['This reel', "didn't post."] as const,
  body: "The page you're after moved, never existed, or is still in the edit.",
  cta: { label: 'Back to home', href: '/' },
} as const;
