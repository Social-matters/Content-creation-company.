import type { Metadata } from 'next';
import { legalCopy, terms } from '@/content/legal';
import { LegalPage } from '@/components/sections/LegalPage';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: terms.title, description: terms.description, alternates: { canonical: '/terms' } };

export default function TermsPageV2() {
  return <LegalPage doc={terms} updatedLabel={legalCopy.updated} Hero={PageHeroV2} />;
}
