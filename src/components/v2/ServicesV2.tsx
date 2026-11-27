'use client';

import { useRef, type CSSProperties } from 'react';
import { gsap } from '@/lib/gsap';
import { mq } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { useNearGSAP } from './flow';
import { services } from '@/content/home';
import { assets } from '@/content/assets';
import type { MediaSlot } from '@/content/types';
import { Video } from '@/components/ui/Video';
import { Button } from '@/components/ui/Button';
import { SectionIntro } from '@/components/sections/SectionIntro';

/** Presentation only: which manifest clip illustrates each offer. */
const MEDIA: Record<(typeof services.items)[number]['key'], MediaSlot> = {
  exhibition: assets.ctaBrand,
  visit: assets.categories.lifestyle,
  performance: assets.categories.food,
  marketplace: assets.categories.beauty,
};
const TONE = ['bg-cream', 'bg-orange', 'bg-white', 'bg-cream-2'];

/**
 * Four offers as a stack: each card sticks, and the one underneath eases back (scale + dim)
 * while the next slides over it. Works on phones too; static under reduced motion.
 */
export function ServicesV2() {
  const root = useRef<HTMLElement>(null);

  useNearGSAP(root, (el) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-card]', el);
    const mm = gsap.matchMedia();
    mm.add(mq.motionOK, () => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true };
        gsap.to(card.querySelector('[data-card-inner]'), { scale: 0.9, yPercent: -3, ease: 'none', scrollTrigger: st });
        gsap.fromTo(card.querySelector('[data-dim]'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', scrollTrigger: st });
      });
      // Media inside each card drifts a touch slower than the card itself.
      cards.forEach((card) => {
        gsap.fromTo(card.querySelector('[data-card-media]'), { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} id={services.id} className="relative bg-ink pb-[var(--section-y)] pt-[var(--section-y)] text-cream">
      <div className="container-x">
        <SectionIntro label={services.label} headline={services.headline} body={services.body} tone="dark" layout="split" />
        <ol className="mt-[clamp(4rem,8vw,7rem)] flex flex-col gap-[12vh]">
          {services.items.map((s, i) => (
            <li
              key={s.key}
              data-card
              className="sticky top-[calc(var(--nav-h)+1rem+var(--i)*1.1rem)]"
              style={{ '--i': i } as CSSProperties}
            >
              <article data-card-inner className={cn('relative grid origin-top overflow-hidden rounded-[2rem] border-2 border-black text-ink will-change-transform md:grid-cols-[1.05fr_1fr] lg:min-h-[min(36rem,68vh)]', TONE[i])}>
                <div className="flex flex-col gap-6 p-7 sm:p-10 lg:p-14">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm">{s.n} / 0{services.items.length}</span>
                    {s.badge && (
                      <span className="flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-cream">
                        <span className="size-1.5 rounded-full bg-orange" />
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-d3">{s.title}</h3>
                  <p className="text-lead max-w-md text-ink/80">{s.body}</p>
                  <ul className="flex flex-wrap gap-2">
                    {s.facts.map((f) => (
                      <li key={f} className="rounded-full border-2 border-black px-3 py-1 text-[0.85rem] font-semibold">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-6">
                    <span className="block font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none">{s.price}</span>
                    <span className="mt-1.5 block font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink/80">{s.priceNote}</span>
                  </p>
                </div>
                <div className="relative m-3 min-h-[16rem] overflow-hidden rounded-[1.5rem] border-2 border-black md:m-4 md:min-h-0">
                  <div data-card-media className="absolute inset-0">
                    <Video media={MEDIA[s.key]} sizes="(min-width: 768px) 45vw, 90vw" decorative className="absolute inset-0" />
                  </div>
                </div>
                <div data-dim aria-hidden className="pointer-events-none invisible absolute inset-0 bg-ink/55" />
              </article>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex justify-center">
          <Button cta={services.cta} variant="outline-dark" />
        </div>
      </div>
    </section>
  );
}
