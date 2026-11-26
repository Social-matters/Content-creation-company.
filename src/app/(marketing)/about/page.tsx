import type { Metadata } from 'next';
import { about } from '@/content/pages';
import { PageHero } from '@/components/sections/PageHero';
import { AboutBacker, AboutProblem } from '@/components/sections/AboutStory';
import { NumberedGrid } from '@/components/sections/Grids';
import { Stats } from '@/components/sections/Stats';
import { CreatorCta } from '@/components/sections/CreatorCta';

export const metadata: Metadata = { title: about.meta.title, description: about.meta.description, alternates: { canonical: '/about' } };

export default function AboutPage() {
  return (
    <>
      <PageHero {...about.hero} />
      <AboutProblem />
      <NumberedGrid {...about.principles} tone="dark" />
      <AboutBacker />
      <Stats />
      <CreatorCta />
    </>
  );
}
