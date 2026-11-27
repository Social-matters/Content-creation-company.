'use client';

import { useRef } from 'react';
import { testimonials } from '@/content/home';
import { PLACEHOLDER_CONTENT } from '@/content/status';
import { useRevealChildren } from '@/components/ui/Reveal';
import { SectionIntro } from '@/components/sections/SectionIntro';
import { FlowWords } from './flow';

/** Quotes read like a page: each one inks in as it passes the reading line. Intro stays put. */
export function VoicesV2() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} className="relative bg-ink py-[var(--section-y)] text-cream">
      <div className="container-x grid gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
        <div className="flex flex-col gap-8 lg:sticky lg:top-[24vh] lg:h-fit">
          <SectionIntro label={testimonials.label} headline={testimonials.headline} tone="dark" size="d3" />
          {PLACEHOLDER_CONTENT && (
            <span data-reveal className="w-fit rounded-full border border-dashed border-cream/35 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-cream/70">
              {testimonials.sampleTag}
            </span>
          )}
        </div>
        <ul className="flex flex-col gap-[clamp(4.5rem,9vw,8rem)]">
          {testimonials.items.map((t) => (
            <li key={t.initials}>
              <figure>
                <span aria-hidden className="block font-display text-[4rem] leading-[0.5] text-orange">
                  &ldquo;
                </span>
                <FlowWords as="blockquote" text={t.quote} dim={0.2} className="mt-4 text-[clamp(1.45rem,2.5vw,2.35rem)] font-medium leading-[1.22] tracking-[-0.01em]" />
                <figcaption data-reveal className="mt-8 flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-full border-2 border-black bg-orange font-mono text-[0.75rem] font-bold text-ink">{t.initials}</span>
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-sm text-cream/55">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
