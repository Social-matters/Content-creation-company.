/** v2 site-wide copy: meta, nav, footer. v1's lives in ../site.ts. */
import { footer } from '../site';
import type { Cta, LinkItem } from '../types';
import type { FooterContent } from '@/components/layout/Footer';

export const v2Meta = {
  /** v2 is a design preview: kept out of search so it doesn't compete with the live pages. */
  robots: { index: false, follow: false },
} as const;


/** Single brand-facing nav: no Brands/Creators toggle. Influencers join via the footer and the join band. */
export const navV2 = {
  links: [
    { label: 'Influencers', href: '/#influencers' },
    { label: 'Celebrities', href: '/celebrities' },
    { label: 'Model Shoots', href: '/model-shoots' },
    { label: 'How it works', href: '/#how' },
  ] satisfies LinkItem[],
  cta: { label: 'Apply', href: '/contact' } satisfies Cta,
};

export const joinNetwork = { label: 'Join our influencer network', modal: 'creator' } satisfies Cta;

export const footerV2: FooterContent = {
  ...footer,
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
        { label: 'Contact', href: '/contact' },
        { label: 'Start a campaign', href: '/start-a-campaign' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ],
  join: joinNetwork,
};
