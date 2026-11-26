'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq, playOnce } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { comparison } from '@/content/home';
import { Icon } from '@/components/ui/Icon';
import { SectionIntro } from './SectionIntro';

/** Values may be prefixed "yes:", "no:" or "partial:" to show a mark. */
function Value({ raw, highlight }: { raw: string; highlight?: boolean }) {
  const m = raw.match(/^(yes|no|partial):(.*)$/);
  const kind = m?.[1];
  const text = m ? m[2] : raw;
  return (
    <span className="flex items-start gap-2.5">
      {kind && (
        <span
          data-mark
          className={cn(
            'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2',
            kind === 'yes' && (highlight ? 'border-black bg-black text-orange' : 'border-orange bg-orange text-black'),
            kind === 'no' && 'border-cream/25 text-cream/40',
            kind === 'partial' && 'border-cream/40 text-cream/70',
          )}
          aria-label={kind === 'yes' ? 'Yes' : kind === 'no' ? 'No' : 'Partly'}
          role="img"
        >
          <Icon name={kind === 'yes' ? 'check' : kind === 'no' ? 'x' : 'plus'} size={13} strokeWidth={3} />
        </span>
      )}
      {text && <span>{text}</span>}
    </span>
  );
}

export function Comparison() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        gsap.utils.toArray<HTMLElement>('[data-row]', root.current).forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', ...playOnce } });
          tl.from(row, { autoAlpha: 0, x: -40, duration: 0.9, ease: 'expo.out' });
          const marks = row.querySelectorAll('[data-mark]');
          if (marks.length) tl.from(marks, { scale: 0, rotate: -90, duration: 0.5, stagger: 0.08, ease: 'back.out(2.5)' }, 0.25);
        });
        gsap.from('[data-col-hl]', { scaleY: 0, transformOrigin: 'top', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '[data-table]', start: 'top 80%', ...playOnce } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-[var(--section-y)] text-cream">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <SectionIntro label={comparison.label} headline={comparison.headline} body={comparison.body} tone="dark" layout="split" />

        {/* Desktop / tablet table */}
        <div data-table className="relative mt-16 hidden md:block">
          <div data-col-hl aria-hidden className="absolute inset-y-0 left-[25%] w-[25%] rounded-[1.6rem] border-2 border-black bg-orange shadow-[8px_8px_0_0_#000]" />
          <table className="relative w-full table-fixed border-separate border-spacing-0 text-left">
            <caption className="sr-only">{comparison.headline.map((l) => (typeof l === 'string' ? l : `${l.before ?? ''}${l.accent}`)).join(' ')}</caption>
            <thead>
              <tr>
                <th scope="col" className="w-1/4 p-5" />
                {comparison.columns.map((c, i) => (
                  <th key={c} scope="col" className={cn('w-1/4 p-5 align-bottom font-display text-[1.25rem] leading-none', i === 0 ? 'text-black' : 'text-cream/80')}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.label} data-row>
                  <th scope="row" className="border-t border-cream/10 p-5 align-top font-mono text-[0.75rem] font-normal uppercase tracking-[0.08em] text-cream/55">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className={cn('border-t p-5 align-top text-[0.98rem]', i === 0 ? 'border-black/15 font-semibold text-black' : 'border-cream/10 text-cream/75')}>
                      <Value raw={v} highlight={i === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one card per row */}
        <div className="mt-12 flex flex-col gap-4 md:hidden">
          {comparison.rows.map((r) => (
            <div key={r.label} data-row className="rounded-[1.4rem] border border-cream/15 bg-ink-2 p-5">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-orange">{r.label}</p>
              <dl className="mt-4 flex flex-col gap-3">
                {r.values.map((v, i) => (
                  <div key={i} className={cn('flex flex-col gap-1', i === 0 && 'rounded-xl border-2 border-black bg-orange p-3 text-black')}>
                    <dt className={cn('text-[0.72rem] font-semibold uppercase', i === 0 ? 'text-black/70' : 'text-cream/45')}>{comparison.columns[i]}</dt>
                    <dd className={i === 0 ? 'font-semibold' : 'text-cream/80'}>
                      <Value raw={v} highlight={i === 0} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
