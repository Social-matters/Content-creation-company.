import type { Metadata } from 'next';
import { about } from '@/content/pages';
import { AboutBacker, AboutProblem } from '@/components/sections/AboutStory';
import { NumberedGrid } from '@/components/sections/Grids';
import { CreatorCta } from '@/components/sections/CreatorCta';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';
import { StatsV2 } from '@/components/v2/StatsV2';

export const metadata: Metadata = { title: about.meta.title, description: about.meta.description, alternates: { canonical: '/about' } };

export default function AboutPageV2() {
  return (
    <>
      <PageHeroV2 {...about.hero} />
      <AboutProblem />
      <NumberedGrid {...about.principles} tone="dark" />
      <AboutBacker />
      <StatsV2 under="bg-orange" />
      <CreatorCta />
    </>
  );
}
