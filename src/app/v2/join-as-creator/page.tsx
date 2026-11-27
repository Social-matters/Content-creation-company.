import type { Metadata } from 'next';
import { formCopy } from '@/content/forms';
import { applyPages } from '@/content/pages';
import { ApplySection } from '@/components/sections/ApplySection';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: formCopy.pages.creator.title, description: formCopy.pages.creator.description, alternates: { canonical: '/join-as-creator' } };

export default function JoinCreatorPageV2() {
  return (
    <>
      <PageHeroV2 {...applyPages.creator} size="d2" />
      <ApplySection kind="creator" />
    </>
  );
}
