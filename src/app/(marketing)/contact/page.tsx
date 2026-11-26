import type { Metadata } from 'next';
import { contact } from '@/content/pages';
import { site } from '@/content/site';
import { PageHero } from '@/components/sections/PageHero';
import { ContactTabs } from '@/components/sections/ContactTabs';

export const metadata: Metadata = { title: contact.meta.title, description: contact.meta.description, alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <>
      <PageHero {...contact.hero}>
        <a
          data-in
          href={`mailto:${site.email}`}
          style={{ textTransform: 'none' }}
          className="w-fit break-all font-display text-[clamp(1.05rem,4.2vw,3.6rem)] leading-none text-orange underline decoration-4 underline-offset-8 transition-colors hover:text-cream"
        >
          {site.email}
        </a>
      </PageHero>
      <ContactTabs />
    </>
  );
}
