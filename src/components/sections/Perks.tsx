'use client';

import { useRef } from 'react';
import { perks } from '@/content/home';
import { RevealText, useRevealChildren } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Eyebrow } from '@/components/ui/Badge';
import { Headline } from '@/components/ui/Headline';

export function Perks() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} className="relative overflow-hidden bg-orange py-[var(--section-y)] text-black">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full border-[3rem] border-black/[0.06]" />
      <div className="container-x relative">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Eyebrow tone="orange">{perks.label}</Eyebrow>
            <Headline lines={perks.headline} size="d1" tone="light" />
          </div>
          <RevealText className="text-lead max-w-md text-black/80">{perks.body}</RevealText>
        </div>
        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {perks.items.map((p, i) => (
            <li key={p.title} data-reveal data-reveal-delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-[1.75rem] border-2 border-black bg-cream p-7 shadow-[6px_6px_0_0_#000] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:shadow-[8px_12px_0_0_#000]">
                <span className="grid size-14 place-items-center rounded-2xl border-2 border-black bg-ink text-orange">
                  <Icon name={p.icon} size={24} />
                </span>
                <h3 className="mt-10 font-display text-[1.7rem] leading-none">{p.title}</h3>
                <p className="mt-3 text-ink/75">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div data-reveal className="mt-12 flex flex-wrap gap-4">
          <Button cta={perks.ctas[0]} variant="ink" />
          <Button cta={perks.ctas[1]} variant="outline-light" />
        </div>
      </div>
    </section>
  );
}
