import { Hero } from '@/components/sections/Hero';
import { CreatorMosaic } from '@/components/sections/CreatorMosaic';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Services } from '@/components/sections/Services';
import { Operations } from '@/components/sections/Operations';
import { Comparison } from '@/components/sections/Comparison';
import { Proof } from '@/components/sections/Proof';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { Perks } from '@/components/sections/Perks';
import { Plans } from '@/components/sections/Plans';
import { BrandCta } from '@/components/sections/BrandCta';
import { CreatorCta } from '@/components/sections/CreatorCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CreatorMosaic />
      <HowItWorks />
      <Services />
      <Operations />
      <Comparison />
      <Proof />
      <Stats />
      <Testimonials />
      <Perks />
      <Plans />
      <BrandCta />
      <CreatorCta />
    </>
  );
}
