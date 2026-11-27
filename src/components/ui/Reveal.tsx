'use client';

import { useRef, type ElementType, type ReactNode, type RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { whenNear } from '@/lib/defer';
import { dur, ease, flow, mq, revealStart, stagger, playOnce } from '@/lib/motion';
import { useSiteVersion } from '@/lib/site-version';

/**
 * Batch fade-up for every `[data-reveal]` element inside `scope` as it enters the viewport.
 * Optional `data-reveal-delay` (seconds) on an element offsets it. Setup is deferred until
 * the section is near the viewport to keep hydration light.
 */
export function useRevealChildren(scope: RefObject<HTMLElement | null>) {
  const v2 = useSiteVersion().version === 'v2';
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
            const y = reduced ? 0 : v2 ? flow.y : 48;
            gsap.set(items, { autoAlpha: 0, y });
            ScrollTrigger.batch(items, {
              start: v2 ? flow.start : revealStart,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: reduced ? 0.5 : v2 ? flow.dur : dur.reveal,
                  ease: v2 ? flow.easeSoft : ease.reveal,
                  stagger: v2 ? flow.stagger : stagger.base,
                  delay: (i, el: HTMLElement) => Number(el.dataset.revealDelay ?? 0),
                  overwrite: true,
                }),
              // v2: settle back out when scrolled back above, so the next pass flows in again.
              onLeaveBack: v2 ? (batch) => gsap.to(batch, { autoAlpha: 0, y, duration: 0.6, ease: flow.easeSoft, overwrite: true }) : undefined,
            });
          });
          return () => mm.revert();
        }),
      );
    },
    { scope, dependencies: [v2] },
  );
}

/** Paragraph whose lines slide up from masks (SplitText) when scrolled into view. */
export function RevealText({ as: Tag = 'p', children, className, delay = 0, play }: { as?: ElementType; children: ReactNode; className?: string; delay?: number; play?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const v2 = useSiteVersion().version === 'v2';
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
            onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: v2 ? flow.dur : dur.reveal, stagger: v2 ? flow.stagger * 0.8 : stagger.tight, ease: ease.reveal, delay, scrollTrigger }),
          });
          return () => split.revert();
        });
        return () => mm.revert();
      };
      if (play === undefined) return whenNear(el, () => context.add(() => setup(v2 ? { trigger: el, start: flow.start, ...flow.toggle } : { trigger: el, start: revealStart, ...playOnce })));
      return setup();
    },
    { scope: ref, dependencies: [play, v2], revertOnUpdate: true },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
