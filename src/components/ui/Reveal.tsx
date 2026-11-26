'use client';

import { useRef, type ElementType, type ReactNode, type RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { dur, ease, mq, revealStart, stagger, playOnce } from '@/lib/motion';

/**
 * Batch fade-up for every `[data-reveal]` element inside `scope` as it enters the viewport.
 * Optional `data-reveal-delay` (seconds) on an element offsets it.
 */
export function useRevealChildren(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
      if (!items.length) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        const reduced = ctx.conditions?.reduced;
        gsap.set(items, { autoAlpha: 0, y: reduced ? 0 : 48 });
        ScrollTrigger.batch(items, {
          start: revealStart,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: reduced ? 0.5 : dur.reveal,
              ease: ease.reveal,
              stagger: stagger.base,
              delay: (i, el: HTMLElement) => Number(el.dataset.revealDelay ?? 0),
              overwrite: true,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}

/** Paragraph whose lines slide up from masks (SplitText) when scrolled into view. */
export function RevealText({ as: Tag = 'p', children, className, delay = 0, play }: { as?: ElementType; children: ReactNode; className?: string; delay?: number; play?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (play === false) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      const scrollTrigger = play === undefined ? { trigger: el, start: revealStart, ...playOnce } : undefined;
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        gsap.set(el, { autoAlpha: 1 });
        if (ctx.conditions?.reduced) {
          gsap.from(el, { autoAlpha: 0, duration: 0.5, delay, scrollTrigger });
          return;
        }
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'copy-line',
          autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: dur.reveal, stagger: stagger.tight, ease: ease.reveal, delay, scrollTrigger }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
