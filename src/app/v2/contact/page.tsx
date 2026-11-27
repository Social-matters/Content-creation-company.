import type { Metadata } from 'next';
import { contact } from '@/content/pages';
import { site } from '@/content/site';
import { ContactTabs } from '@/components/sections/ContactTabs';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: contact.meta.title, description: contact.meta.description, alternates: { canonical: '/contact' } };

export default function ContactPageV2() {
  return (
    <>
      <PageHeroV2 {...contact.hero}>
        <a
          data-in
          href={`mailto:${site.email}`}
          style={{ textTransform: 'none' }}
          className="w-fit break-all font-display text-[clamp(1rem,2.6vw,2.4rem)] sm:break-normal leading-none text-orange underline decoration-4 underline-offset-8 transition-colors hover:text-cream"
        >
          {site.email}
        </a>
      </PageHeroV2>
      <ContactTabs />
    </>
  );
}
