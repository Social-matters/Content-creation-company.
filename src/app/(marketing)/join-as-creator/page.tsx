import type { Metadata } from 'next';
import { formCopy } from '@/content/forms';
import { applyPages } from '@/content/pages';
import { PageHero } from '@/components/sections/PageHero';
import { ApplySection } from '@/components/sections/ApplySection';

export const metadata: Metadata = { title: formCopy.pages.creator.title, description: formCopy.pages.creator.description, alternates: { canonical: '/join-as-creator' } };

export default function JoinCreatorPage() {
  return (
    <>
      <PageHero {...applyPages.creator} size="d2" />
      <ApplySection kind="creator" />
    </>
  );
}
