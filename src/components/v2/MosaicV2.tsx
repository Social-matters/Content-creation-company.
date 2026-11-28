'use client';

import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { useNearGSAP } from './flow';
import { mosaicV2 as mosaic } from '@/content/v2/home';
import { assets } from '@/content/assets';
import type { MediaSlot } from '@/content/types';
import { Eyebrow } from '@/components/ui/Badge';
import { RevealText } from '@/components/ui/Reveal';
import { Video } from '@/components/ui/Video';
import { Icon } from '@/components/ui/Icon';

const COLS = 4;
/** Phones show the first rows of the first two columns only. */
const MOBILE_ROWS = 3;
/** Column drift (yPercent across the section) and resting offsets: four speeds read as depth. */
const DRIFT = [
  [6, -10],
  [16, -22],
  [2, -14],
  [20, -26],
];
const OFFSET = ['', 'lg:mt-28', 'lg:mt-10', 'lg:mt-40'];
const ECHOES = 3;

type TileData = (typeof mosaic.tiles)[number];

function Label({ tile }: { tile: TileData }) {
  if (tile.type)
    return <span className="absolute left-3 top-3 z-10 rounded-full bg-orange px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.08em] text-ink">{tile.type}</span>;
  if (!tile.tag) return null;
  return <span className="absolute left-3 top-3 z-10 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.06em] text-cream">{tile.tag}</span>;
}

/** Stand-in for talent we can't show yet (no real celebrity or actor imagery). */
function RosterPlaceholder({ tile }: { tile: TileData }) {
  return (
    <div data-tile className="relative">
      <div className="relative grid aspect-[9/16] place-items-center overflow-hidden rounded-[1.5rem] border border-dashed border-cream/25 bg-ink-3">
        <div aria-hidden className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(255_129_42/0.45),transparent)]" />
        <Label tile={tile} />
        <div className="relative flex flex-col items-center gap-3 px-4 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-cream/20 text-orange">
            <Icon name="star" size={20} />
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-cream/65">{mosaic.rosterPlaceholder}</span>
        </div>
      </div>
    </div>
  );
}

function Tile({ media, tile }: { media: MediaSlot; tile: TileData }) {
  const [hover, setHover] = useState(false);
  return (
    <div data-tile className="relative">
      <div
        data-cursor={mosaic.hoverLabel}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className="group relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-ink-2 ring-1 ring-cream/10 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.03]"
      >
        <Video media={media} mode="hover" active={hover} sizes="(min-width: 1024px) 14vw, 45vw" className="absolute inset-0" />
        <Label tile={tile} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute bottom-3.5 left-3.5 grid size-8 place-items-center rounded-full bg-cream/90 text-ink transition-[transform,opacity] duration-500 group-hover:scale-75 group-hover:opacity-0">
          <Icon name="play" size={12} />
        </span>
      </div>
    </div>
  );
}

/** Influencer mosaic. "Brief once. Watch it multiply." The last word echoes into outlined copies as you scroll. */
export function MosaicV2() {
  const root = useRef<HTMLElement>(null);
  const columns = Array.from({ length: COLS }, (_, c) => mosaic.tiles.filter((_, i) => i % COLS === c));
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
    <section ref={root} id={mosaic.id} className="relative scroll-mt-0 overflow-hidden bg-ink py-[var(--section-y)] text-cream">
      <div className="container-x grid gap-20 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-[clamp(3.5rem,6vw,7rem)]">
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

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-5">
          {columns.map((items, c) => (
            <div key={c} data-col className={cn('flex flex-col gap-4 sm:gap-5', OFFSET[c], c >= 2 && 'max-lg:hidden')}>
              {items.map((t, r) => (
                <div key={r} className={cn(r >= MOBILE_ROWS && 'max-lg:hidden')}>
                  {t.m === undefined ? <RosterPlaceholder tile={t} /> : <Tile media={assets.mosaic[t.m]} tile={t} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
