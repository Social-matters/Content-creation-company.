'use client';

import { useRef } from 'react';
import { about } from '@/content/pages';
import { RevealText, useRevealChildren } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Badge';
import { Logo } from '@/components/brand/Logo';
import { SectionIntro } from './SectionIntro';

export function AboutProblem() {
  return (
    <section className="bg-cream py-[var(--section-y)] text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <SectionIntro label={about.problem.label} headline={about.problem.headline} size="d3" />
        <div className="flex flex-col gap-5">
          {about.problem.paragraphs.map((p, i) => (
            <RevealText key={p} delay={i * 0.08} className={i === about.problem.paragraphs.length - 1 ? 'text-lead font-semibold' : 'text-lead text-ink/75'}>
              {p}
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutBacker() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);
  return (
    <section ref={root} className="bg-orange py-[var(--section-y)] text-black">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Eyebrow tone="orange">{about.backer.label}</Eyebrow>
          <h2 data-reveal className="mt-5 font-display text-d2">
            {about.backer.title}
          </h2>
          <p data-reveal className="text-lead mt-6 max-w-2xl text-black/80">
            {about.backer.body}
          </p>
        </div>
        <div data-reveal className="rotate-[-4deg] rounded-[2rem] border-2 border-black bg-ink p-8 shadow-[10px_10px_0_0_#000]">
          <Logo className="h-28 w-auto" />
        </div>
      </div>
    </section>
  );
}
