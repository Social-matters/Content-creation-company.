'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { proof } from '@/content/home';
import { proofV2 } from '@/content/v2/home';
import { assets } from '@/content/assets';
import type { Headline as HeadlineContent } from '@/content/types';
import { Eyebrow } from '@/components/ui/Badge';
import { Headline } from '@/components/ui/Headline';
import { Video } from '@/components/ui/Video';

type Intro = { label: string; headline: HeadlineContent; body: string };

function IntroBlock({ intro }: { intro: Intro }) {
  return (
    <div className="flex flex-col gap-7">
      <Eyebrow>{intro.label}</Eyebrow>
      <Headline lines={intro.headline} size="d2" tone="dark" />
      <p className="text-lead max-w-sm text-cream/70">{intro.body}</p>
    </div>
  );
}

/**
 * Eight categories as a film strip. Desktop: pinned, scroll moves the strip sideways, the intro
 * slides out first and each clip drifts inside its frame. Phones / reduced motion: native swipe.
 */
export function ProofV2({ intro = proof }: { intro?: Intro }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const track = q('[data-track]')[0];
      const mm = gsap.matchMedia();
      mm.add(`${mq.motionOK} and ${mq.desktop}`, () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: el, pin: true, start: 'top top', end: () => `+=${distance()}`, scrub: flow.scrub, invalidateOnRefresh: true },
        });
        gsap.fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: flow.scrub, invalidateOnRefresh: true } });
        q('[data-card]').forEach((card) => {
          const st = { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true };
          gsap.fromTo(card.querySelector('[data-par]'), { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: st });
          gsap.fromTo(card.querySelector('[data-lift]'), { y: 50, rotate: 2 }, { y: 0, rotate: 0, ease: 'power2.out', scrollTrigger: { ...st, end: 'center 60%' } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    // Own wrapper: the pinned section gets wrapped in a spacer, so React must never insert beside it.
    <div>
    <section ref={root} id={proof.id} className="relative overflow-hidden bg-ink text-cream">
      <div className="flex flex-col justify-center py-[var(--section-y)] lg:motion-safe:h-dvh lg:motion-safe:pb-16 lg:motion-safe:pt-[calc(var(--nav-h)+2rem)]">
        <div className="container-x lg:motion-safe:hidden">
          <IntroBlock intro={intro} />
        </div>
        <div className="mt-14 overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:motion-safe:mt-0 lg:motion-safe:overflow-visible [&::-webkit-scrollbar]:hidden">
          <ul data-track className="flex w-max snap-x snap-mandatory items-center gap-4 px-[var(--gutter)] sm:gap-6 lg:gap-8">
            <li className="hidden w-[min(34rem,36vw)] shrink-0 pr-[4vw] lg:motion-safe:block">
              <IntroBlock intro={intro} />
            </li>
            {proof.items.map((item, i) => (
              <li key={item.key} data-card className="w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-[clamp(16rem,23vw,24rem)]">
                <figure data-lift>
                  <div data-cursor={proof.hoverLabel} className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-ink-2 ring-1 ring-cream/10">
                    <div data-par className="absolute -inset-x-[9%] inset-y-0">
                      <Video media={assets.categories[item.key]} sizes="(min-width: 1024px) 26vw, 72vw" className="absolute inset-0" />
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[0.65rem] text-cream">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <figcaption className="mt-5">
                    <span className="block font-display text-[clamp(1.1rem,1.6vw,1.45rem)] leading-tight">{item.title}</span>
                    <span className="mt-1.5 block text-[0.95rem] text-cream/60">{item.line}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
        <div className="container-x mt-10 flex items-center gap-4">
          <p aria-hidden className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-cream/65 lg:motion-safe:hidden">{proofV2.hint} →</p>
          <span aria-hidden className="relative hidden h-px flex-1 bg-cream/15 lg:motion-safe:block">
            <span data-progress className="absolute inset-0 origin-left bg-orange" style={{ transform: 'scaleX(0)' }} />
          </span>
        </div>
      </div>
    </section>
    </div>
  );
}
