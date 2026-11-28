'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { cn } from '@/lib/cn';
import { clients, type ClientLogo } from '@/content/clients';
import { clientsV2 as copy } from '@/content/v2/home';
import { useUIActions } from '@/components/providers/UIProvider';
import { Eyebrow } from '@/components/ui/Badge';
import { Marquee } from '@/components/ui/Marquee';
import { Icon } from '@/components/ui/Icon';
import { useRevealChildren } from '@/components/ui/Reveal';

/**
 * Optical sizing: logos range from 5:1 wordmarks to square emblems, so equal heights look
 * uneven. Height falls with the square root of the aspect ratio (roughly equal area).
 */
function size(logo: ClientLogo, scale: number) {
  const aspect = logo.width / logo.height;
  const ideal = Math.min(72, Math.max(34, 82 / Math.sqrt(aspect)));
  // Capped at 140px wide so every logo fits the narrowest grid cell without being squeezed.
  const width = Math.round(Math.min(ideal * aspect, 140) * scale);
  return { width, height: Math.round(width / aspect) };
}

function Logo({ logo, scale = 1, className, alt = logo.name }: { logo: ClientLogo; scale?: number; className?: string; alt?: string }) {
  const s = size(logo, scale);
  // Unoptimized: the files are already small WebPs, and all three placements share one cached request per logo.
  // The explicit aspect-ratio keeps the rendered box exactly in step with the width/height attributes.
  return (
    <Image
      src={logo.src}
      alt={alt}
      width={s.width}
      height={s.height}
      unoptimized
      className={cn('h-auto max-w-full select-none object-contain', className)}
      style={{ width: s.width, height: 'auto', aspectRatio: `${s.width} / ${s.height}` }}
      draggable={false}
    />
  );
}

/** Quiet drifting row under the hero buttons. Pure CSS (no per-frame JS); still under reduced motion. */
export function HeroClientStrip() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-cream/60">{copy.title}</p>
      <span className="sr-only">{clients.map((c) => c.name).join(', ')}</span>
      <div aria-hidden className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_88%,transparent)]">
        <div className="logo-drift flex w-max">
          {[0, 1].map((copyIndex) => (
            <ul key={copyIndex} className="flex shrink-0 items-center">
              {clients.map((c) => (
                <li key={c.src} className="pr-10">
                  <Logo logo={c} scale={0.68} alt="" className="opacity-75" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

const byName = new Map(clients.map((c) => [c.name, c]));
const names = clients.map((c) => c.name);

/** Full-width logo band: the same scroll-reactive marquee as the text bands. */
export function ClientBand() {
  return (
    <section aria-label={copy.title} className="border-y border-cream/10 bg-ink py-9 sm:py-12">
      <Marquee
        items={names}
        speed={38}
        separator={null}
        copies={2}
        itemClassName="px-7 sm:px-12"
        renderItem={(name) => <Logo logo={byName.get(name)!} alt="" className="opacity-80" />}
      />
    </section>
  );
}

/** Static grid: every logo at once, with one open slot that starts a campaign. */
export function ClientGrid() {
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);
  const { openModal } = useUIActions();
  const cell = 'flex h-28 items-center justify-center rounded-[1.1rem] px-2.5 sm:h-32';
  return (
    <section ref={root} className="relative bg-ink py-[var(--section-y)] text-cream">
      <div className="container-x">
        <Eyebrow>{copy.label}</Eyebrow>
        <h2 className="mt-5 font-display text-d3">{copy.title}</h2>
        <ul className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
          {clients.map((c, i) => (
            <li key={c.src} data-reveal data-reveal-delay={(i % 6) * 0.04}>
              <div className={cn(cell, 'group border border-cream/10 bg-ink-2 transition-colors duration-500 hover:border-cream/30')}>
                <Logo logo={c} className="opacity-75 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </li>
          ))}
          <li data-reveal>
            <button
              type="button"
              onClick={() => copy.openSlot.modal && openModal(copy.openSlot.modal)}
              className={cn(cell, 'w-full flex-col gap-2 border border-dashed border-orange/60 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-orange transition-colors duration-300 hover:bg-orange hover:text-ink')}
            >
              <Icon name="plus" size={18} />
              {copy.openSlot.label}
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
}
