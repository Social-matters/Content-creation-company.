'use client';

import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { useNearGSAP } from './flow';
import { mosaic } from '@/content/home';
import { assets } from '@/content/assets';
import type { MediaSlot } from '@/content/types';
import { Eyebrow } from '@/components/ui/Badge';
import { RevealText } from '@/components/ui/Reveal';
import { Video } from '@/components/ui/Video';
import { Icon } from '@/components/ui/Icon';

const COLS = 3;
const PER_COL = 4;
/** Column drift (yPercent across the section) and resting offsets: three speeds read as depth. */
const DRIFT = [
  [6, -10],
  [16, -22],
  [2, -14],
];
const OFFSET = ['', 'lg:mt-32', 'lg:mt-14'];
const ECHOES = 3;

function Tile({ media }: { media: MediaSlot }) {
  const [hover, setHover] = useState(false);
  return (
    <div data-tile className="relative">
      <div
        data-cursor={mosaic.hoverLabel}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className="group relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-ink-2 ring-1 ring-cream/10 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.03]"
      >
        <Video media={media} mode="hover" active={hover} sizes="(min-width: 1024px) 18vw, 45vw" className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute bottom-3.5 left-3.5 grid size-8 place-items-center rounded-full bg-cream/90 text-ink transition-[transform,opacity] duration-500 group-hover:scale-75 group-hover:opacity-0">
          <Icon name="play" size={12} />
        </span>
      </div>
    </div>
  );
}

/** "Write it once. Watch it multiply." The last word echoes into outlined copies as you scroll. */
export function MosaicV2() {
  const root = useRef<HTMLElement>(null);
  const tiles = assets.mosaic.slice(0, COLS * PER_COL);
  const columns = Array.from({ length: COLS }, (_, c) => tiles.filter((_, i) => i % COLS === c));
  const [l1, l2, last] = mosaic.headline;
  const echo = typeof last === 'string' ? last : last.accent;

  useNearGSAP(root, (el) => {
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add({ motion: mq.motionOK, desktop: mq.desktop }, (ctx) => {
      if (!ctx.conditions?.motion) return;
      // Headline lines rise in, and rewind when you scroll back above.
      gsap.from(q('[data-line]'), { yPercent: 105, rotate: 2.5, transformOrigin: '0% 100%', duration: flow.dur, stagger: 0.12, ease: flow.ease, scrollTrigger: { trigger: q('[data-headline]')[0], start: flow.start, ...flow.toggle } });
      // Echoes spread out of the word while the section passes.
      gsap.fromTo(
        q('[data-echo]'),
        { yPercent: 0, autoAlpha: 0 },
        { yPercent: (i) => (i + 1) * 30, autoAlpha: (i) => 0.42 - i * 0.12, ease: 'none', scrollTrigger: { trigger: q('[data-headline]')[0], start: 'top 70%', end: 'top 15%', scrub: flow.scrub } },
      );
      // Tiles settle in as they enter, following the scroll.
      q('[data-tile]').forEach((t) => {
        gsap.fromTo(t, { autoAlpha: 0, y: 80, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: t, start: 'top 102%', end: 'top 68%', scrub: flow.scrub } });
      });
      if (!ctx.conditions.desktop) return;
      q('[data-col]').forEach((col, i) => {
        gsap.fromTo(col, { yPercent: DRIFT[i][0] }, { yPercent: DRIFT[i][1], ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-[var(--section-y)] text-cream">
      <div className="container-x grid gap-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-[clamp(4rem,7vw,8rem)]">
        <div className="flex flex-col gap-8 lg:sticky lg:top-[24vh] lg:h-fit">
          <Eyebrow>{mosaic.label}</Eyebrow>
          <h2 data-headline aria-label={[l1, l2, echo].join(' ')} className="font-display text-[clamp(2.6rem,5vw,5.25rem)] leading-[0.9]">
            {[l1, l2].map((l) => (
              <span key={String(l)} aria-hidden className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">
                  {String(l)}
                </span>
              </span>
            ))}
            <span aria-hidden className="relative block">
              {Array.from({ length: ECHOES }, (_, i) => (
                <span
                  key={i}
                  data-echo
                  className="invisible absolute inset-0 block text-transparent"
                  style={{ WebkitTextStroke: '0.022em var(--ccc-orange)', zIndex: -1 - i }}
                >
                  {echo}
                </span>
              ))}
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block text-orange">
                  {echo}
                </span>
              </span>
            </span>
          </h2>
          <RevealText className="text-lead max-w-md text-cream/70 lg:mt-[clamp(4rem,9vw,8rem)]">{mosaic.body}</RevealText>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {columns.map((items, c) => (
            <div key={c} data-col className={cn('flex flex-col gap-4 sm:gap-5 lg:gap-6', OFFSET[c], c === 2 && 'max-lg:hidden')}>
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
