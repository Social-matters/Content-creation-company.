'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { brandCta } from '@/content/home';
import { joinBandV2 as join } from '@/content/v2/home';
import { assets } from '@/content/assets';
import { useNearGSAP } from './flow';
import { useRevealChildren } from '@/components/ui/Reveal';
import { Headline } from '@/components/ui/Headline';
import { Button } from '@/components/ui/Button';
import { Video } from '@/components/ui/Video';

/**
 * Closing call. A circular "portal" opens onto a shoot day as the section arrives, ringed in
 * orange; the influencer-network invitation sits quietly underneath.
 */
export function FinaleV2() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  useNearGSAP(root, (el) => {
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(mq.motionOK, () => {
      const open = { trigger: el, start: 'top 85%', end: 'top 10%', scrub: flow.scrub };
      gsap.fromTo(q('[data-portal-clip]'), { clipPath: 'circle(6% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', ease: 'power2.inOut', scrollTrigger: open });
      gsap.fromTo(q('[data-portal-zoom]'), { scale: 1.45 }, { scale: 1, ease: 'power2.out', scrollTrigger: open });
      gsap.fromTo(q('[data-ring]'), { scale: 0.12, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'power2.inOut', scrollTrigger: open });
      gsap.fromTo(q('[data-portal]'), { yPercent: 6 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-ink text-cream">
      <div className="grain pointer-events-none absolute inset-0 -z-10" />
      <div className="container-x relative flex min-h-[100svh] flex-col justify-center gap-14 py-[var(--section-y)] lg:block lg:pt-[calc(var(--section-y)*1.2)]">
        <div data-portal aria-hidden className="relative mx-auto aspect-square w-[min(86vw,26rem)] lg:absolute lg:right-[-6%] lg:top-[8%] lg:w-[min(52vw,52rem)]">
          <div data-ring className="absolute -inset-4 rounded-full border-2 border-orange/70" />
          <div data-portal-clip className="absolute inset-0 overflow-hidden rounded-full [clip-path:circle(50%_at_50%_50%)]">
            <div data-portal-zoom className="absolute inset-0">
              <Video media={assets.ctaBrand} sizes="(min-width: 1024px) 52vw, 86vw" decorative className="absolute inset-0" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/10 to-transparent max-lg:hidden" />
          </div>
        </div>

        <div className="relative flex flex-col gap-10 lg:max-w-[62%]">
          <Headline lines={brandCta.headline} size="d1" tone="dark" />
          <p data-reveal className="text-lead max-w-sm text-cream/80">
            {brandCta.body}
          </p>
          <div data-reveal className="flex flex-wrap gap-3">
            <Button cta={brandCta.ctas[0]} />
            <Button cta={brandCta.ctas[1]} variant="outline-dark" icon="calendar" />
          </div>
        </div>

        <div data-reveal className="relative mt-[clamp(5rem,12vw,10rem)] flex flex-col gap-8 border-t border-cream/10 pt-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-orange">{join.label}</p>
            <p className="font-display text-d4">{join.title}</p>
            <p className="max-w-md text-cream/65">{join.body}</p>
          </div>
          <Button cta={join.cta} variant="outline-dark" />
        </div>
      </div>
    </section>
  );
}
