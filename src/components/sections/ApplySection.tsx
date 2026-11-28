'use client';

import type { ComponentProps } from 'react';
import type { Headline as HeadlineContent } from '@/content/types';
import { BrandForm } from '@/components/forms/LeadForms';
import { SectionIntro } from './SectionIntro';

type Props = { label: string; headline: HeadlineContent; body: string; id: string; /** Sent as a celebrity or model shoot enquiry, with that need pre-ticked. */ enquiry: NonNullable<ComponentProps<typeof BrandForm>['enquiry']> };

/** Enquiry form in a brutal card, on the Celebrities and Model Shoots pages. */
export function ApplySection({ label, headline, body, id, enquiry }: Props) {
  return (
    <section id={id} className="bg-cream py-[var(--section-y)] text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionIntro label={label} headline={headline} body={body} size="d2" className="lg:sticky lg:top-28" />
        <div className="rounded-[2rem] border-2 border-black bg-white shadow-[10px_10px_0_0_var(--ccc-orange)]">
          <BrandForm titleId={`enquiry-${enquiry}`} enquiry={enquiry} />
        </div>
      </div>
    </section>
  );
}
