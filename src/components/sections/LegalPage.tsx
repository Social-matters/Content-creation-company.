import type { LegalDoc } from '@/content/legal';
import { PageHeroV2 } from '@/components/v2/PageHeroV2';

/** Long-form legal document: ink hero + readable single column. */
export function LegalPage({ doc, updatedLabel }: { doc: LegalDoc; updatedLabel: string }) {
  return (
    <>
      <PageHeroV2 headline={[doc.title]} lead={doc.intro} size="d2" badge={`${updatedLabel} ${doc.updated}`} />
      <article className="bg-cream py-[var(--section-y)] text-ink">
        <div className="container-x max-w-3xl">
          {doc.sections.map((s, i) => (
            <section key={s.heading} className="border-t-2 border-black/10 py-8 first:border-t-0 first:pt-0">
              <h2 className="flex items-baseline gap-4 font-display text-[1.5rem] leading-tight">
                <span className="font-mono text-sm text-orange-text">{String(i + 1).padStart(2, '0')}</span>
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-4 text-[1.05rem] leading-relaxed text-ink/80">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
