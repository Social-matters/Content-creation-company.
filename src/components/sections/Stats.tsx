'use client';

import { useRef } from 'react';
import { stats } from '@/content/home';
import { cn } from '@/lib/cn';
import { useRevealChildren } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { Eyebrow } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { SectionIntro } from './SectionIntro';

export function Stats() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-[var(--section-y)] text-cream">
      <div className="grain pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 size-[30rem] rounded-full bg-orange/20 blur-[120px]" />
      <div className="container-x relative">
        <SectionIntro label={stats.label} headline={stats.headline} tone="dark" />
        <dl className="mt-16 grid grid-cols-2 border-l border-t border-cream/10 lg:grid-cols-4">
          {stats.items.map((s) => (
            <div key={s.label} data-reveal className="flex min-w-0 flex-col justify-between gap-10 overflow-hidden border-b border-r border-cream/10 p-5 sm:p-8">
              <dt className="order-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cream/55">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(2.4rem,4.4vw,4.9rem)] leading-none text-orange">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-center">
          <div data-reveal>
            <Eyebrow>{stats.slotsLabel}</Eyebrow>
            <h3 className="mt-4 font-display text-d4">{stats.slotsTitle}</h3>
            <p className="mt-4 max-w-sm text-cream/70">{stats.slotsBody}</p>
          </div>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
            {Array.from({ length: stats.slotsTotal }, (_, i) => {
              const taken = i < stats.slotsTaken;
              return (
                <li
                  key={i}
                  data-reveal
                  data-reveal-delay={(i % 4) * 0.05}
                  className={cn(
                    'flex aspect-[5/3] flex-col items-center justify-center gap-1.5 rounded-2xl text-center font-mono text-[0.68rem] uppercase tracking-[0.08em]',
                    taken ? 'border-2 border-black bg-ink-3 text-cream/45' : 'border-2 border-dashed border-cream/25 text-cream/70 transition-colors hover:border-orange hover:text-orange',
                  )}
                >
                  <Icon name={taken ? 'lock' : 'plus'} size={16} />
                  {taken ? stats.slotsTakenText : stats.slotText}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
