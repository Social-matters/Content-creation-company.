'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq, playOnce } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { mosaic } from '@/content/home';
import { assets } from '@/content/assets';
import type { MediaSlot } from '@/content/types';
import { SectionIntro } from './SectionIntro';
import { Video } from '@/components/ui/Video';
import { Icon } from '@/components/ui/Icon';

const COLS = 4;
/** Per-column parallax travel (yPercent of the column) and start offsets. */
const SPEED = [-6, -20, -10, -26];
const OFFSET = ['', 'lg:mt-24', 'lg:mt-10', 'lg:mt-40'];

function Tile({ media }: { media: MediaSlot }) {
  const [hover, setHover] = useState(false);
  return (
    <div data-tile className="relative hover:z-10">
    <div
      data-cursor={mosaic.hoverLabel}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="group relative aspect-[9/16] overflow-hidden rounded-[1.4rem] border-2 border-black bg-ink-2 shadow-[5px_5px_0_0_#000] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.04] hover:shadow-[8px_8px_0_0_var(--ccc-orange)]"
    >
      <Video media={media} mode="hover" active={hover} sizes="(min-width: 1024px) 15vw, 45vw" className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="absolute bottom-3 left-3 grid size-8 place-items-center rounded-full bg-cream/90 text-ink transition-transform duration-500 group-hover:scale-0">
        <Icon name="play" size={12} />
      </span>
    </div>
    </div>
  );
}

export function CreatorMosaic() {
  const root = useRef<HTMLElement>(null);
  const columns = Array.from({ length: COLS }, (_, c) => assets.mosaic.filter((_, i) => i % COLS === c));

  useGSAP(
    () => {
      const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]', root.current);
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, desktop: mq.desktop }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        // Reveal from the centre of the grid outward.
        gsap.from(tiles, {
          autoAlpha: 0,
          scale: 0.82,
          y: 60,
          duration: 1.1,
          ease: 'expo.out',
          stagger: { each: 0.05, from: 'center', grid: 'auto' },
          scrollTrigger: { trigger: '[data-grid]', start: 'top 80%', ...playOnce },
        });
        if (!ctx.conditions.desktop) return;
        gsap.utils.toArray<HTMLElement>('[data-col]', root.current).forEach((col, i) => {
          gsap.to(col, { yPercent: SPEED[i], ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink pb-[var(--section-y)] pt-10 text-cream">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-[22vh] lg:h-fit">
          <SectionIntro label={mosaic.label} headline={mosaic.headline} body={mosaic.body} tone="dark" size="d2" />
        </div>
        <div data-grid className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {columns.map((items, c) => (
            <div key={c} data-col className={cn('flex flex-col gap-3 sm:gap-4', OFFSET[c], c >= 2 && 'max-lg:hidden')}>
              {items.map((m) => (
                <Tile key={m.poster} media={m} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
