import type { Metadata } from 'next';
import { assets } from '@/content/assets';
import { categoriesIntro, creatorApply, creatorFaq, creatorsHero, creatorsMeta, earn, handled } from '@/content/creators';
import { NumberedGrid, IconCards } from '@/components/sections/Grids';
import { Tiers } from '@/components/sections/Tiers';
import { Faq } from '@/components/sections/Faq';
import { ApplySection } from '@/components/sections/ApplySection';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';
import { ProofV2 } from '@/components/v2/ProofV2';

export const metadata: Metadata = { title: creatorsMeta.title, description: creatorsMeta.description, alternates: { canonical: '/creators' } };

export default function CreatorsPageV2() {
  return (
    <>
      <PageHeroV2 {...creatorsHero} media={assets.creatorsHero} mobileMedia={assets.creatorsHeroMobile} />
      <NumberedGrid {...earn} items={earn.steps} />
      <ProofV2 intro={categoriesIntro} />
      <Tiers />
      <IconCards {...handled} />
      <Faq {...creatorFaq} />
      <ApplySection kind="creator" id="apply" {...creatorApply} />
    </>
  );
}
