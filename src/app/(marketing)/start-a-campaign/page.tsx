import type { Metadata } from 'next';
import { formCopy } from '@/content/forms';
import { applyPages } from '@/content/pages';
import { PageHero } from '@/components/sections/PageHero';
import { ApplySection } from '@/components/sections/ApplySection';

export const metadata: Metadata = { title: formCopy.pages.brand.title, description: formCopy.pages.brand.description, alternates: { canonical: '/start-a-campaign' } };

export default function StartCampaignPage() {
  return (
    <>
      <PageHero {...applyPages.brand} size="d2" />
      <ApplySection kind="brand" />
    </>
  );
}
