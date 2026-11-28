'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { statsV2 as stats } from '@/content/v2/home';
import { PLACEHOLDER_CONTENT } from '@/content/status';
import { SectionIntro } from '@/components/sections/SectionIntro';
import { Counter } from '@/components/ui/Counter';
import { Sheet, useNearGSAP } from './flow';

/** Early numbers: generous, quiet, odometer digits; hairlines draw in with the scroll. */
export function StatsV2({ under = 'bg-ink' }: { under?: string }) {
  const root = useRef<HTMLElement>(null);

  useNearGSAP(root, (el) => {
    const mm = gsap.matchMedia();
    mm.add(mq.motionOK, () => {
      gsap.fromTo(el.querySelectorAll('[data-hair]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', stagger: 0.15, scrollTrigger: { trigger: el.querySelector('[data-stats]'), start: 'top 92%', end: 'top 55%', scrub: flow.scrub } });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} className={`relative isolate py-[var(--section-y)] text-ink ${under}`}>
      <Sheet tone="cream" />
      <div className="container-x">
        <SectionIntro label={stats.label} headline={stats.headline} />
        {PLACEHOLDER_CONTENT && (
          <span className="mt-6 inline-block rounded-full border border-dashed border-ink/40 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink/75">{stats.sampleTag}</span>
        )}
        <dl data-stats className="mt-[clamp(4rem,8vw,7rem)] grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
          {stats.items.map((s) => (
            <div key={s.label} className="relative flex flex-col gap-4 pt-8">
              <span data-hair aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-black/25" />
              <dt className="order-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink/60">{s.label}</dt>
              <dd className="order-1">
                <Counter value={s.value} suffix={s.suffix} className="font-display text-[clamp(2.8rem,5.6vw,5.5rem)]" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
