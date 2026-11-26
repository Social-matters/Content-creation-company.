'use client';

import type { Headline as HeadlineContent } from '@/content/types';
import { BrandForm, CreatorForm } from '@/components/forms/LeadForms';
import { SectionIntro } from './SectionIntro';

type Props = { kind: 'brand' | 'creator'; label?: string; headline?: HeadlineContent; body?: string; id?: string };

/** Inline application form in a brutal card. Same forms as the modals. */
export function ApplySection({ kind, label, headline, body, id }: Props) {
  const titleId = `apply-${kind}`;
  return (
    <section id={id} className="bg-cream py-[var(--section-y)] text-ink">
      <div className={headline ? 'container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start' : 'container-x max-w-4xl'}>
        {headline ? <SectionIntro label={label} headline={headline} body={body} size="d2" className="lg:sticky lg:top-28" /> : null}
        <div className="rounded-[2rem] border-2 border-black bg-white shadow-[10px_10px_0_0_var(--ccc-orange)]">
          {kind === 'brand' ? <BrandForm titleId={titleId} /> : <CreatorForm titleId={titleId} />}
        </div>
      </div>
    </section>
  );
}
