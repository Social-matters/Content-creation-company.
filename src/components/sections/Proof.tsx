'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq, playOnce } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { proof } from '@/content/home';
import { assets } from '@/content/assets';
import { Video } from '@/components/ui/Video';
import { SectionIntro } from './SectionIntro';

/** Staggered vertical offsets give the grid a loose, editorial rhythm on desktop. */
const SHIFT = ['', 'lg:translate-y-16', 'lg:translate-y-6', 'lg:translate-y-24'];

export function Proof() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        gsap.utils.toArray<HTMLElement>('[data-proof]', root.current).forEach((el, i) => {
          const st = { trigger: el, start: 'top 88%', ...playOnce };
          if (ctx.conditions?.reduced) {
            gsap.from(el, { autoAlpha: 0, duration: 0.6, scrollTrigger: st });
            return;
          }
          const tl = gsap.timeline({ scrollTrigger: st, delay: (i % 4) * 0.08 });
          tl.fromTo(el.querySelector('[data-curtain]'), { clipPath: 'inset(100% 0% 0% 0% round 1.5rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', duration: 1.3, ease: 'expo.inOut' })
            .fromTo(el.querySelector('[data-zoom]'), { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.15)
            .from(el.querySelectorAll('[data-cap]'), { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.7);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={proof.id} className="relative overflow-hidden bg-cream pb-[calc(var(--section-y)+4rem)] pt-[var(--section-y)] text-ink">
      <div className="container-x">
        <SectionIntro label={proof.label} headline={proof.headline} body={proof.body} layout="split" />
        <div className="mt-16 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:mt-20 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
          {proof.items.map((item, i) => (
            <figure key={item.key} data-proof className={cn(SHIFT[i % 4])}>
              <div data-curtain data-cursor={proof.hoverLabel} className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] border-2 border-black shadow-[6px_6px_0_0_#000]">
                <div data-zoom className="absolute inset-0">
                  <Video media={assets.categories[item.key]} sizes="(min-width: 1024px) 24vw, 48vw" className="absolute inset-0" />
                </div>
                <span className="absolute left-3 top-3 rounded-full border-2 border-black bg-cream px-2.5 py-1 font-mono text-[0.62rem] font-bold uppercase">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <figcaption className="mt-4 overflow-hidden">
                <span data-cap className="block font-display text-[clamp(1.05rem,1.7vw,1.5rem)] leading-tight">
                  {item.title}
                </span>
                <span data-cap className="mt-1 block text-[0.92rem] text-ink/65">
                  {item.line}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
