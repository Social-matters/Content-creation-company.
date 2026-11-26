'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq, playOnce } from '@/lib/motion';
import { creatorCta } from '@/content/home';
import { assets } from '@/content/assets';
import { useRevealChildren } from '@/components/ui/Reveal';
import { Headline } from '@/components/ui/Headline';
import { Button } from '@/components/ui/Button';
import { Video } from '@/components/ui/Video';
import { Icon } from '@/components/ui/Icon';

export function CreatorCta() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        gsap.from('[data-card]', { clipPath: 'inset(8% 6% 8% 6% round 3rem)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: root.current, start: 'top 75%', ...playOnce } });
        gsap.fromTo('[data-media]', { yPercent: 8, rotate: 4 }, { yPercent: -8, rotate: -2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-cream py-[var(--section-y)]">
      <div className="container-x">
        <div data-card className="relative grid overflow-hidden rounded-[2.25rem] border-2 border-black bg-ink text-cream shadow-[10px_10px_0_0_var(--ccc-orange)] lg:grid-cols-[1.2fr_1fr]">
          <div aria-hidden className="pointer-events-none absolute -bottom-32 right-1/4 size-[30rem] rounded-full bg-orange/30 blur-[110px]" />
          <div className="relative flex flex-col gap-6 p-8 sm:p-12 lg:p-16">
            <p data-reveal className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-orange">
              {creatorCta.label}
            </p>
            <Headline lines={creatorCta.headline} size="d2" tone="dark" />
            <p data-reveal className="text-lead max-w-md text-cream/80">
              {creatorCta.body}
            </p>
            <p data-reveal className="flex items-center gap-2 font-mono text-[0.78rem] uppercase tracking-[0.08em] text-cream/70">
              <Icon name="check" size={16} className="text-orange" strokeWidth={3} />
              {creatorCta.note}
            </p>
            <div data-reveal className="mt-4 flex flex-wrap items-center gap-6">
              <Button cta={creatorCta.ctas[0]} />
              <Button cta={creatorCta.ctas[1]} variant="link-dark" />
            </div>
          </div>
          <div className="relative min-h-[26rem] lg:min-h-full">
            <div data-media className="absolute inset-x-8 inset-y-10 sm:inset-x-16 lg:inset-x-12">
              <div className="relative h-full overflow-hidden rounded-[1.75rem] border-2 border-black shadow-[8px_8px_0_0_#000]">
                <Video media={assets.ctaCreator} sizes="(min-width: 1024px) 35vw, 90vw" decorative className="absolute inset-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
