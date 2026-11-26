'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';
import type { Headline } from '@/content/types';
import { useRevealChildren } from '@/components/ui/Reveal';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SectionIntro } from './SectionIntro';

type Intro = { id?: string; label: string; headline: Headline; body?: string };

/** Numbered step/principle cards (creators "how you earn", about "principles"). */
export function NumberedGrid({ id, label, headline, body, items, tone = 'light' }: Intro & { items: readonly { n: string; title: string; body: string }[]; tone?: 'light' | 'dark' }) {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);
  const dark = tone === 'dark';
  return (
    <section ref={root} id={id} className={cn('relative overflow-hidden py-[var(--section-y)]', dark ? 'bg-ink text-cream' : 'bg-cream text-ink')}>
      {dark && <div className="grain pointer-events-none absolute inset-0" />}
      <div className="container-x relative">
        <SectionIntro label={label} headline={headline} body={body} tone={tone} layout="split" />
        <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <li key={s.n} data-reveal data-reveal-delay={i * 0.06}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-[1.6rem] border-2 p-6 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5',
                  dark ? 'border-cream/15 bg-ink-2 shadow-[6px_6px_0_0_var(--ccc-orange)]' : 'border-black bg-white shadow-[6px_6px_0_0_#000]',
                )}
              >
                <span className={cn('font-display text-[3.2rem] leading-none', dark ? 'text-orange' : 'text-orange-display')}>{s.n}</span>
                <h3 className="mt-12 font-display text-[1.5rem] leading-none">{s.title}</h3>
                <p className={cn('mt-3', dark ? 'text-cream/70' : 'text-ink/70')}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Icon cards on orange (creators "what we handle"). */
export function IconCards({ label, headline, items }: Intro & { items: readonly { title: string; body: string; icon: IconName }[] }) {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);
  return (
    <section ref={root} className="bg-orange py-[var(--section-y)] text-black">
      <div className="container-x">
        <SectionIntro label={label} headline={headline} tone="orange" />
        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <li key={it.title} data-reveal data-reveal-delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-[1.6rem] border-2 border-black bg-cream p-6 shadow-[6px_6px_0_0_#000]">
                <span className="grid size-12 place-items-center rounded-xl border-2 border-black bg-ink text-orange">
                  <Icon name={it.icon} size={22} />
                </span>
                <h3 className="mt-10 font-display text-[1.4rem] leading-none">{it.title}</h3>
                <p className="mt-3 text-ink/75">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
