import type { Metadata } from 'next';
import { comparisonV2, marqueesV2 } from '@/content/v2/home';
import { Marquee } from '@/components/ui/Marquee';
import { Comparison } from '@/components/sections/Comparison';
import { HeroV2 } from '@/components/v2/HeroV2';
import { MosaicV2 } from '@/components/v2/MosaicV2';
import { HowItWorksV2 } from '@/components/v2/HowItWorksV2';
import { ServicesV2 } from '@/components/v2/ServicesV2';
import { OperationsV2 } from '@/components/v2/OperationsV2';
import { ProofV2 } from '@/components/v2/ProofV2';
import { StatsV2 } from '@/components/v2/StatsV2';
import { VoicesV2 } from '@/components/v2/VoicesV2';
import { ClientBand, ClientGrid } from '@/components/v2/Clients';
import { FinaleV2 } from '@/components/v2/FinaleV2';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const band = 'border-y-2 border-black py-5';
const bandText = 'font-display text-[clamp(1.4rem,2.6vw,2.4rem)]';

/** Home: influencer marketing leads (hero, mosaic, influencer services, proof); creator content supports. */
export default function HomePage() {
  return (
    <>
      <HeroV2 />
      <MosaicV2 />
      <ClientBand />
      <ServicesV2 />
      <HowItWorksV2 />
      <Marquee items={marqueesV2.formats} speed={45} className={`${band} bg-orange text-black`} itemClassName={bandText} />
      <OperationsV2 under="bg-orange" />
      <Marquee items={marqueesV2.cities} direction={-1} speed={40} className={`${band} bg-ink text-cream`} itemClassName={bandText} />
      <ProofV2 />
      <Comparison content={comparisonV2} />
      <StatsV2 />
      <ClientGrid />
      <VoicesV2 />
      <FinaleV2 />
    </>
  );
}
