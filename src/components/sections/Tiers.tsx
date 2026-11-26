'use client';

import { useRef } from 'react';
import { tiers } from '@/content/creators';
import { cn } from '@/lib/cn';
import { useRevealChildren } from '@/components/ui/Reveal';
import { SectionIntro } from './SectionIntro';

const STYLES = ['bg-cream text-ink', 'bg-orange text-black', 'bg-white text-ink', 'bg-ink-3 text-cream'];

export function Tiers() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);
  return (
    <section ref={root} id={tiers.id} className="relative overflow-hidden bg-ink py-[var(--section-y)] text-cream">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <SectionIntro label={tiers.label} headline={tiers.headline} body={tiers.body} tone="dark" layout="split" />
        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.items.map((t, i) => (
            <li key={t.name} data-reveal data-reveal-delay={i * 0.07}>
              <div
                className={cn(
                  'flex h-full min-h-[24rem] flex-col rounded-[1.75rem] border-2 border-black p-7 shadow-[6px_6px_0_0_var(--ccc-orange)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:-rotate-1',
                  STYLES[i],
                )}
              >
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] opacity-70">{t.range}</span>
                <h3 className="mt-3 font-display text-[clamp(2.6rem,4vw,3.6rem)] leading-none">{t.name}</h3>
                <p className="mt-auto pt-12 opacity-80">{t.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {t.formats.map((f) => (
                    <li key={f} className="rounded-full border border-current/30 px-3 py-1 text-[0.78rem]">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
