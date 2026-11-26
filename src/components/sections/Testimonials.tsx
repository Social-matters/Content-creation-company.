'use client';

import { useRef } from 'react';
import { testimonials } from '@/content/home';
import { PLACEHOLDER_CONTENT } from '@/content/status';
import { cn } from '@/lib/cn';
import { useRevealChildren } from '@/components/ui/Reveal';
import { SectionIntro } from './SectionIntro';

const TILT = ['lg:-rotate-[1.5deg]', 'lg:translate-y-12 lg:rotate-[1deg]', 'lg:-rotate-[0.5deg]'];

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} className="relative overflow-hidden bg-cream py-[var(--section-y)] text-ink">
      <div className="container-x">
        <SectionIntro label={testimonials.label} headline={testimonials.headline} />
        <ul className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-8 lg:pb-12">
          {testimonials.items.map((t, i) => (
            <li key={t.initials} data-reveal data-reveal-delay={i * 0.08}>
              <figure className={cn('flex h-full flex-col rounded-[1.75rem] border-2 border-black bg-white p-7 shadow-[6px_6px_0_0_#000] transition-transform duration-500 hover:rotate-0 sm:p-8', TILT[i])}>
                {PLACEHOLDER_CONTENT && (
                  <span className="mb-6 w-fit rounded-full border border-dashed border-ink/40 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink/75">{testimonials.sampleTag}</span>
                )}
                <span aria-hidden className="font-display text-[4.5rem] leading-[0.6] text-orange-display">
                  &ldquo;
                </span>
                <blockquote className="mt-2 text-[1.2rem] font-medium leading-snug">{t.quote}</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-8">
                  <span className="grid size-11 place-items-center rounded-full border-2 border-black bg-orange font-mono text-[0.75rem] font-bold">{t.initials}</span>
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-sm text-ink/60">{t.role}</span>
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
