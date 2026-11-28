import type { Metadata } from 'next';
import { joinPage } from '@/content/v2/pages';
import { ApplySection } from '@/components/sections/ApplySection';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: joinPage.meta.title, description: joinPage.meta.description, alternates: { canonical: '/join-as-creator' } };

export default function JoinNetworkPageV2() {
  return (
    <>
      <PageHeroV2 {...joinPage.hero} size="d2" />
      <ApplySection kind="creator" />
    </>
  );
}
