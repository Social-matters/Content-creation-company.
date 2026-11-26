'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq } from '@/lib/motion';
import { brandCta } from '@/content/home';
import { assets } from '@/content/assets';
import { useRevealChildren } from '@/components/ui/Reveal';
import { Headline } from '@/components/ui/Headline';
import { Button } from '@/components/ui/Button';
import { Video } from '@/components/ui/Video';

export function BrandCta() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        gsap.fromTo('[data-bg]', { yPercent: -12, scale: 1.2 }, { yPercent: 12, scale: 1.05, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink py-[var(--section-y)] text-cream">
      <div data-bg className="absolute inset-0 -z-10">
        <Video media={assets.ctaBrand} sizes="100vw" decorative className="absolute inset-0" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
      <div className="grain pointer-events-none absolute inset-0 -z-10" />
      <div className="container-x flex flex-col gap-10">
        <Headline lines={brandCta.headline} size="d1" tone="dark" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p data-reveal className="text-lead max-w-sm text-cream/85">
            {brandCta.body}
          </p>
          <div data-reveal className="flex flex-wrap gap-3">
            <Button cta={brandCta.ctas[0]} />
            <Button cta={brandCta.ctas[1]} variant="outline-dark" icon="calendar" />
          </div>
        </div>
      </div>
    </section>
  );
}
