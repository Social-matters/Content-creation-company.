import type { Metadata } from 'next';
import { formCopy } from '@/content/forms';
import { applyPages } from '@/content/pages';
import { ApplySection } from '@/components/sections/ApplySection';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: formCopy.pages.brand.title, description: formCopy.pages.brand.description, alternates: { canonical: '/start-a-campaign' } };

export default function StartCampaignPageV2() {
  return (
    <>
      <PageHeroV2 {...applyPages.brand} size="d2" />
      <ApplySection kind="brand" />
    </>
  );
}
