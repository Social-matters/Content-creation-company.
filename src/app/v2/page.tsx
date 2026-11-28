import type { Metadata } from 'next';
import { marquees } from '@/content/home';
import { Marquee } from '@/components/ui/Marquee';
import { HeroV2 } from '@/components/v2/HeroV2';
import { MosaicV2 } from '@/components/v2/MosaicV2';
import { HowItWorksV2 } from '@/components/v2/HowItWorksV2';
import { ServicesV2 } from '@/components/v2/ServicesV2';
import { OperationsV2 } from '@/components/v2/OperationsV2';
import { ProofV2 } from '@/components/v2/ProofV2';
import { StatsV2 } from '@/components/v2/StatsV2';
import { VoicesV2 } from '@/components/v2/VoicesV2';
import { FinaleV2 } from '@/components/v2/FinaleV2';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function HomeV2() {
  return (
    <>
      <HeroV2 />
      <MosaicV2 />
      <HowItWorksV2 />
      <ServicesV2 />
      <OperationsV2 />
      <ProofV2 />
      <Marquee items={marquees.formats} speed={45} className="border-y-2 border-black bg-orange py-5 text-black" itemClassName="font-display text-[clamp(1.4rem,2.6vw,2.4rem)]" />
      <StatsV2 under="bg-orange" />
      <VoicesV2 />
      <FinaleV2 />
    </>
  );
}
