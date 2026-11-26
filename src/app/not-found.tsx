import type { Metadata } from 'next';
import { notFound as copy } from '@/content/site';
import { MarketingShell } from '@/components/layout/MarketingShell';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = { title: copy.code, robots: { index: false } };

export default function NotFound() {
  return (
    <MarketingShell>
      <PageHero badge={copy.code} headline={[copy.title[0], { accent: copy.title[1], style: 'block' }]} lead={copy.body} ctas={[copy.cta]} />
    </MarketingShell>
  );
}
