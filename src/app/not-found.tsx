import type { Metadata } from 'next';
import { notFound as copy } from '@/content/site';
import { MarketingShell } from '@/components/layout/MarketingShell';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: copy.code, robots: { index: false } };

export default function NotFound() {
  return (
    <MarketingShell>
      <PageHeroV2 badge={copy.code} headline={[copy.title[0], { accent: copy.title[1], style: 'block' }]} lead={copy.body} ctas={[copy.cta]} />
    </MarketingShell>
  );
}
