import type { Metadata } from 'next';
import { assets } from '@/content/assets';
import { modelShootsPage as p } from '@/content/v2/pages';
import { NumberedGrid } from '@/components/sections/Grids';
import { ApplySection } from '@/components/sections/ApplySection';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: p.meta.title, description: p.meta.description, alternates: { canonical: '/model-shoots' } };

export default function ModelShootsPage() {
  return (
    <>
      <PageHeroV2 {...p.hero} media={assets.ctaBrand} mobileMedia={assets.models[1]} />
      <NumberedGrid {...p.included} />
      <NumberedGrid {...p.how} tone="dark" />
      <ApplySection kind="brand" id="enquire" enquiry="model-shoot" {...p.enquiry} />
    </>
  );
}
