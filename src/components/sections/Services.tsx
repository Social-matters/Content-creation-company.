'use client';

import { useRef } from 'react';
import { services } from '@/content/home';
import { cn } from '@/lib/cn';
import { useRevealChildren } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionIntro } from './SectionIntro';

export function Services() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} id={services.id} className="relative overflow-hidden bg-ink py-[var(--section-y)] text-cream">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <SectionIntro label={services.label} headline={services.headline} body={services.body} tone="dark" layout="split" />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
          {services.items.map((s, i) => (
            <div key={s.key} data-reveal data-reveal-delay={(i % 2) * 0.08}>
              <Card tone="ink" interactive data-cursor="View" className={cn('group flex h-full flex-col overflow-hidden p-7 sm:p-9', s.badge && 'border-orange/60')}>
                <span aria-hidden data-n={s.n} className="pointer-events-none absolute -right-4 -top-10 font-display text-[11rem] leading-none text-cream/[0.04] transition-colors duration-500 before:content-[attr(data-n)] group-hover:text-orange/15" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-orange">{s.n}</span>
                  {s.badge && <Badge tone="orange">{s.badge}</Badge>}
                </div>
                <h3 className="mt-14 font-display text-d4">{s.title}</h3>
                <p className="mt-4 max-w-md text-[1.05rem] text-cream/70">{s.body}</p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-12">
                  <p>
                    <span className="block font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-orange">{s.price}</span>
                    <span className="mt-1.5 block font-mono text-[0.72rem] uppercase tracking-[0.08em] text-cream/50">{s.priceNote}</span>
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {s.facts.map((f) => (
                      <li key={f} className="rounded-full border border-cream/20 px-3 py-1 text-[0.8rem] text-cream/80">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          ))}
        </div>
        <div data-reveal className="mt-12 flex justify-center">
          <Button cta={services.cta} variant="outline-dark" />
        </div>
      </div>
    </section>
  );
}
