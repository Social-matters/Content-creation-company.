import type { Metadata } from 'next';
import { contact } from '@/content/pages';
import { joinSection, site } from '@/content/site';
import { ContactTabs } from '@/components/sections/ContactTabs';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

export const metadata: Metadata = { title: contact.meta.title, description: contact.meta.description, alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <>
      <PageHeroV2 {...contact.hero} id={joinSection.id} size="d2">
        <div data-in className="flex flex-col gap-4">
          <p className="max-w-xl text-cream/70">{contact.writeFirst}</p>
          <a
            href={`mailto:${site.email}`}
            style={{ textTransform: 'none' }}
            className="w-fit break-all font-display text-[clamp(1rem,2.6vw,2.4rem)] leading-none text-orange underline decoration-4 underline-offset-8 transition-colors hover:text-cream sm:break-normal"
          >
            {site.email}
          </a>
        </div>
      </PageHeroV2>
      <ContactTabs />
    </>
  );
}
