import type { Metadata } from 'next';
import { pricingPage } from '@/content/pages';
import { Plans } from '@/components/sections/Plans';
import { Comparison } from '@/components/sections/Comparison';
import { Faq } from '@/components/sections/Faq';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';
import { ServicesV2 } from '@/components/v2/ServicesV2';
import { FinaleV2 } from '@/components/v2/FinaleV2';

export const metadata: Metadata = { title: pricingPage.meta.title, description: pricingPage.meta.description, alternates: { canonical: '/pricing' } };

export default function PricingPageV2() {
  return (
    <>
      <PageHeroV2 {...pricingPage.hero} size="d2" />
      <Plans withIntro={false} />
      <ServicesV2 />
      <Comparison />
      <Faq {...pricingPage.faq} />
      <FinaleV2 withCreator={false} />
    </>
  );
}
