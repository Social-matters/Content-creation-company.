import type { Metadata } from 'next';
import { assets } from '@/content/assets';
import { categoriesIntro, creatorApply, creatorFaq, creatorsHero, creatorsMeta, earn, handled } from '@/content/creators';
import { PageHero } from '@/components/sections/PageHero';
import { NumberedGrid, IconCards } from '@/components/sections/Grids';
import { Proof } from '@/components/sections/Proof';
import { Tiers } from '@/components/sections/Tiers';
import { Faq } from '@/components/sections/Faq';
import { ApplySection } from '@/components/sections/ApplySection';

export const metadata: Metadata = { title: creatorsMeta.title, description: creatorsMeta.description, alternates: { canonical: '/creators' } };

export default function CreatorsPage() {
  return (
    <>
      <PageHero {...creatorsHero} media={assets.creatorsHero} mobileMedia={assets.creatorsHeroMobile} />
      <NumberedGrid {...earn} items={earn.steps} />
      <Proof intro={categoriesIntro} />
      <Tiers />
      <IconCards {...handled} />
      <Faq {...creatorFaq} />
      <ApplySection kind="creator" id="apply" {...creatorApply} />
    </>
  );
}
