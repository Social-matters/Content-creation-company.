'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { ENTRANCE_KEY, ENTRANCE_MIN_WIDTH, mq } from '@/lib/motion';
import { useUIActions } from '@/components/providers/UIProvider';
import { LogoMark } from '@/components/brand/LogoMark';
import { entrance } from '@/content/site';

/**
 * Entrance (~2.1s): the C³ mark draws in, a counter runs 000→100, an orange
 * panel wipes up, then the whole curtain lifts to reveal the page. Marks the
 * entrance done just as the curtain starts to lift so the hero can begin.
 * Skipped on repeat visits in the session, on phones (ENTRANCE_MIN_WIDTH) and under reduced motion.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const { markEntranceDone } = useUIActions();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const html = document.documentElement;
      let played = false;
      try {
        played = sessionStorage.getItem(ENTRANCE_KEY) === '1';
      } catch {}
      if (played || window.innerWidth < ENTRANCE_MIN_WIDTH || html.classList.contains('entrance-skip') || window.matchMedia(mq.reduced).matches) {
        gsap.set(el, { display: 'none' });
        html.classList.remove('is-loading');
        markEntranceDone();
        return;
      }

      const arcs = gsap.utils.toArray<SVGPathElement>('[data-arc]', el);
      arcs.forEach((a) => {
        const len = a.getTotalLength();
        gsap.set(a, { strokeDasharray: len, strokeDashoffset: len });
      });
      const count = el.querySelector<HTMLElement>('[data-count]');
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', el);
      const counter = { v: 0 };

      const finish = () => {
        html.classList.remove('is-loading');
        try {
          sessionStorage.setItem(ENTRANCE_KEY, '1');
        } catch {}
        markEntranceDone();
      };

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => gsap.set(el, { display: 'none' }) });
      tl.from('[data-meta]', { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'expo.out' }, 0)
        .to(arcs, { strokeDashoffset: 0, duration: 0.95, stagger: 0.12 }, 0.05)
        .from('[data-sup]', { autoAlpha: 0, scale: 0.4, transformOrigin: 'center', duration: 0.4, ease: 'back.out(3)' }, 0.75)
        .to(
          counter,
          {
            v: 100,
            duration: 1.25,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count) count.textContent = String(Math.round(counter.v)).padStart(3, '0');
            },
          },
          0,
        );
      words.forEach((w, i) => {
        tl.fromTo(w, { yPercent: 100 }, { yPercent: 0, duration: 0.32, ease: 'expo.out' }, 0.05 + i * 0.3).to(w, { yPercent: -100, duration: 0.28, ease: 'expo.in' }, 0.3 + i * 0.3);
      });
      tl.fromTo('[data-panel]', { yPercent: 100 }, { yPercent: 0, duration: 0.55 }, 1.2)
        .from('[data-panel-mark]', { scale: 0.6, rotate: -30, autoAlpha: 0, duration: 0.5, ease: 'expo.out' }, 1.45)
        .add(finish, 1.62)
        .to(el, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, 1.62)
        .to('[data-panel-mark]', { yPercent: 60, duration: 0.6, ease: 'power3.inOut' }, 1.62);
    },
    { scope: root },
  );

  return (
    <div ref={root} data-preloader aria-hidden className="fixed inset-0 z-[120] overflow-hidden bg-ink text-cream">
      <div className="grain absolute inset-0" />
      <div className="container-x relative flex h-full flex-col justify-between py-6 sm:py-8">
        <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cream/60">
          <span data-meta>{entrance.label}</span>
          <span data-meta className="relative inline-block h-[1.2em] w-28 overflow-hidden text-right">
            {entrance.words.map((w) => (
              <span key={w} data-word className="absolute inset-0 translate-y-full">
                {w}…
              </span>
            ))}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LogoMark className="size-28 text-orange sm:size-36" strokeWidth={9} />
        </div>
        <div className="flex items-end justify-between">
          <span data-meta className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cream/60">
            {entrance.ready}
          </span>
          <span data-count className="font-display text-[clamp(5rem,16vw,13rem)] leading-[0.8] text-orange">
            000
          </span>
        </div>
      </div>
      <div data-panel className="absolute inset-0 grid translate-y-full place-items-center bg-orange">
        <LogoMark data-panel-mark className="size-24 text-ink sm:size-32" strokeWidth={9} />
      </div>
    </div>
  );
}
