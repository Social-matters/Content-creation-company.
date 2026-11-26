import type { Metadata } from 'next';
import { pricingPage } from '@/content/pages';
import { PageHero } from '@/components/sections/PageHero';
import { Plans } from '@/components/sections/Plans';
import { Services } from '@/components/sections/Services';
import { Comparison } from '@/components/sections/Comparison';
import { Faq } from '@/components/sections/Faq';
import { BrandCta } from '@/components/sections/BrandCta';

export const metadata: Metadata = { title: pricingPage.meta.title, description: pricingPage.meta.description, alternates: { canonical: '/pricing' } };

export default function PricingPage() {
  return (
    <>
      <PageHero {...pricingPage.hero} size="d2" />
      <Plans withIntro={false} />
      <Services />
      <Comparison />
      <Faq {...pricingPage.faq} />
      <BrandCta />
    </>
  );
}
