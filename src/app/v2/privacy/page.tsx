import type { Metadata } from 'next';
import { legalCopy, privacy } from '@/content/legal';
import { LegalPage } from '@/components/sections/LegalPage';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: privacy.title, description: privacy.description, alternates: { canonical: '/privacy' } };

export default function PrivacyPageV2() {
  return <LegalPage doc={privacy} updatedLabel={legalCopy.updated} Hero={PageHeroV2} />;
}
