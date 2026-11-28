import type { Metadata } from 'next';
import { celebritiesPage as p } from '@/content/v2/pages';
import { NumberedGrid } from '@/components/sections/Grids';
import { ApplySection } from '@/components/sections/ApplySection';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: p.meta.title, description: p.meta.description };

/** Lean service page. No celebrity imagery or names until CCC supplies licensed material. */
export default function CelebritiesPageV2() {
  return (
    <>
      <PageHeroV2 {...p.hero} size="d1" />
      <NumberedGrid {...p.included} />
      <NumberedGrid {...p.how} tone="dark" />
      <ApplySection kind="brand" id="enquire" need="celebrity" {...p.enquiry} />
    </>
  );
}
