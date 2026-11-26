import type { Metadata } from 'next';
import { legalCopy, privacy } from '@/content/legal';
import { LegalPage } from '@/components/sections/LegalPage';

export const metadata: Metadata = { title: privacy.title, description: privacy.description, alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return <LegalPage doc={privacy} updatedLabel={legalCopy.updated} />;
}
