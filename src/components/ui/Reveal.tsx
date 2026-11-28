'use client';

import { useRef, type ElementType, type ReactNode, type RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { whenNear } from '@/lib/defer';
import { ease, flow, mq } from '@/lib/motion';

/**
 * Batch fade-up for every `[data-reveal]` element inside `scope` as it enters the viewport.
 * Optional `data-reveal-delay` (seconds) on an element offsets it. Setup is deferred until
 * the section is near the viewport to keep hydration light.
 */
export function useRevealChildren(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    (context) => {
      const root = scope.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
      if (!items.length) return;
      return whenNear(root, () =>
        context.add(() => {
          const mm = gsap.matchMedia();
          mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
            const reduced = ctx.conditions?.reduced;
            const y = reduced ? 0 : flow.y;
            gsap.set(items, { autoAlpha: 0, y });
            ScrollTrigger.batch(items, {
              start: flow.start,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: reduced ? 0.5 : flow.dur,
                  ease: flow.easeSoft,
                  stagger: flow.stagger,
                  delay: (i, el: HTMLElement) => Number(el.dataset.revealDelay ?? 0),
                  overwrite: true,
                }),
              // Settle back out when scrolled back above, so the next pass flows in again.
              onLeaveBack: (batch) => gsap.to(batch, { autoAlpha: 0, y, duration: 0.6, ease: flow.easeSoft, overwrite: true }),
            });
          });
          return () => mm.revert();
        }),
      );
    },
    { scope },
  );
}

/** Paragraph whose lines slide up from masks (SplitText) when scrolled into view. */
export function RevealText({ as: Tag = 'p', children, className, delay = 0, play }: { as?: ElementType; children: ReactNode; className?: string; delay?: number; play?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    (context) => {
      const el = ref.current;
      if (!el) return;
      if (play === false) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      const setup = (scrollTrigger?: ScrollTrigger.Vars) => {
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
            aria: 'none',
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: flow.dur, stagger: flow.stagger * 0.8, ease: ease.reveal, delay, scrollTrigger }),
          });
          return () => split.revert();
        });
        return () => mm.revert();
      };
      if (play === undefined) return whenNear(el, () => context.add(() => setup({ trigger: el, start: flow.start, ...flow.toggle })));
      return setup();
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
