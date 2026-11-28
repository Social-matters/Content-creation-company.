'use client';

import { useRef, type CSSProperties } from 'react';
import { gsap } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { useNearGSAP } from './flow';
import { servicesV2 as services } from '@/content/v2/home';
import { serviceEnquiryHref } from '@/content/site';
import { Video } from '@/components/ui/Video';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Eyebrow } from '@/components/ui/Badge';
import { SectionIntro } from '@/components/sections/SectionIntro';

const TONE = ['bg-cream', 'bg-orange', 'bg-white', 'bg-cream-2'];
const pricingCta = ({ key, title }: { key: string; title: string }) => ({ label: services.pricingLink, href: serviceEnquiryHref(key), context: title });

/** Stand-in panel for celebrity / actor work until licensed imagery is supplied (no real people). */
export function RosterPanel({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn('absolute inset-0 grid place-items-center overflow-hidden bg-ink-3', className)}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-3/4 bg-[radial-gradient(55%_75%_at_50%_0%,rgb(255_129_42/0.5),transparent)]" />
      <div aria-hidden className="absolute inset-x-[12%] bottom-[18%] h-px bg-cream/10" />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-full border border-cream/20 text-orange">
          <Icon name="star" size={22} />
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-cream/70">{label}</span>
      </div>
    </div>
  );
}

/**
 * Services, weighted: four influencer offers as a stack of large cards (each sticks and eases
 * back as the next slides over), then a split bar, then the creator-content offers as a
 * compact row. Static under reduced motion.
 */
export function ServicesV2() {
  const root = useRef<HTMLElement>(null);
  const { influencer, creator, split } = services;

  useNearGSAP(root, (el) => {
    const q = gsap.utils.selector(el);
    const cards = q('[data-card]');
    const mm = gsap.matchMedia();
    mm.add(mq.motionOK, () => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true };
        gsap.to(card.querySelector('[data-card-inner]'), { scale: 0.9, yPercent: -3, ease: 'none', scrollTrigger: st });
        gsap.fromTo(card.querySelector('[data-dim]'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', scrollTrigger: st });
      });
      q('[data-card-media]').forEach((m) => {
        gsap.fromTo(m, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      // Split bar fills with the scroll; compact cards rise in.
      gsap.fromTo(q('[data-split]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', stagger: 0.25, scrollTrigger: { trigger: q('[data-split-bar]')[0], start: 'top 90%', end: 'top 55%', scrub: flow.scrub } });
      gsap.fromTo(q('[data-compact]'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: flow.dur, stagger: flow.stagger, ease: flow.ease, scrollTrigger: { trigger: q('[data-compact-grid]')[0], start: flow.start, ...flow.toggle } });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} id={services.id} className="relative bg-ink pb-[var(--section-y)] pt-[var(--section-y)] text-cream">
      <div className="container-x">
        <SectionIntro label={services.label} headline={services.headline} body={services.body} tone="dark" layout="split" />

        {/* Influencer marketing: the main story */}
        <ol className="mt-[clamp(4rem,8vw,7rem)] flex flex-col gap-[12vh]">
          {influencer.map((s, i) => (
            <li key={s.key} id={s.key === 'celebrity' ? 'celebrities' : undefined} data-card className="sticky top-[calc(var(--nav-h)+1rem+var(--i)*1.1rem)]" style={{ '--i': i } as CSSProperties}>
              <article data-card-inner className={cn('relative grid origin-top overflow-hidden rounded-[2rem] border-2 border-black text-ink will-change-transform md:grid-cols-[1.05fr_1fr] lg:min-h-[min(36rem,68vh)]', TONE[i])}>
                <div className="flex flex-col gap-6 p-7 sm:p-10 lg:p-14">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm">
                      {s.n} / 0{influencer.length}
                    </span>
                    {s.badge && (
                      <span className="flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-cream">
                        <span className="size-1.5 animate-pulse rounded-full bg-orange motion-reduce:animate-none" />
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
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-6">
                    <Button cta={pricingCta(s)} variant="link-light" />
                    {s.more && <Button cta={s.more} variant="link-light" />}
                  </div>
                </div>
                <div className="relative m-3 min-h-[16rem] overflow-hidden rounded-[1.5rem] border-2 border-black md:m-4 md:min-h-0">
                  {s.media ? (
                    <div data-card-media className="absolute inset-0">
                      <Video media={s.media} sizes="(min-width: 768px) 45vw, 90vw" decorative className="absolute inset-0" />
                    </div>
                  ) : (
                    <RosterPanel label={services.rosterPlaceholder} />
                  )}
                </div>
                <div data-dim aria-hidden className="pointer-events-none invisible absolute inset-0 bg-ink/55" />
              </article>
            </li>
          ))}
        </ol>

        {/* Split bar: the weighting, shown rather than claimed */}
        <div data-split-bar aria-hidden className="mt-[clamp(5rem,10vw,9rem)] flex gap-1.5">
          <div className="flex basis-[70%] flex-col gap-3">
            <span className="h-1.5 overflow-hidden rounded-full bg-cream/10">
              <span data-split className="block h-full origin-left rounded-full bg-orange" />
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cream/60">{split.primary}</span>
          </div>
          <div className="flex basis-[30%] flex-col gap-3">
            <span className="h-1.5 overflow-hidden rounded-full bg-cream/10">
              <span data-split className="block h-full origin-left rounded-full bg-cream" />
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cream/60">{split.secondary}</span>
          </div>
        </div>

        {/* Creator content: the supporting story, compact */}
        <div id={creator.id} className="mt-14 grid scroll-mt-28 gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,2fr)] lg:gap-14">
          <div className="flex flex-col gap-4">
            <Eyebrow>{creator.label}</Eyebrow>
            <h3 className="font-display text-d4">{creator.title}</h3>
            <p className="max-w-xs text-cream/70">{creator.body}</p>
          </div>
          <ul data-compact-grid className="grid gap-4 sm:grid-cols-3">
            {creator.items.map((c) => (
              <li key={c.key} data-compact className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-cream/12 bg-ink-2 transition-[transform,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-cream/30">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Video media={c.media} sizes="(min-width: 640px) 22vw, 90vw" decorative className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4 xl:p-5">
                  <h4 className="font-display text-[1.15rem] leading-tight">{c.title}</h4>
                  <p className="text-[0.92rem] text-cream/70">{c.body}</p>
                  <div className="mt-auto flex flex-col items-start pt-3">
                    <Button cta={pricingCta(c)} variant="link-dark" className="whitespace-nowrap gap-2! text-[0.68rem]! tracking-[0.03em]! text-orange!" />
                    {c.more && <Button cta={c.more} variant="link-dark" className="whitespace-nowrap gap-2! text-[0.68rem]! tracking-[0.03em]!" />}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <Button cta={services.ctas[0]} />
          <Button cta={services.ctas[1]} variant="outline-dark" icon="calendar" />
        </div>
      </div>
    </section>
  );
}
