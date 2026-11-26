import type { Metadata } from 'next';
import { legalCopy, terms } from '@/content/legal';
import { LegalPage } from '@/components/sections/LegalPage';

export const metadata: Metadata = { title: terms.title, description: terms.description, alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return <LegalPage doc={terms} updatedLabel={legalCopy.updated} />;
}
