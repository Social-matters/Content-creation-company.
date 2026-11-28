'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { whenNear } from '@/lib/defer';
import { flow, mq } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * useGSAP whose setup runs only once `scope` comes near the viewport (lib/defer.ts), inside the
 * same context so it's cleaned up on unmount. For non-pinned scroll effects: keeps hydration
 * light and leaves below-the-fold content in its final, readable state until you get close.
 * Pins must stay eager (they shift every trigger after them).
 */
export function useNearGSAP(scope: RefObject<HTMLElement | null>, setup: (el: HTMLElement) => void | (() => void), margin?: string) {
  useGSAP(
    (context) => {
      const el = scope.current;
      if (!el) return;
      return whenNear(el, () => context.add(() => setup(el)), margin);
    },
    { scope },
  );
}

/**
 * True once `ref` is at least `threshold` in view (then stays true). Used to hold back a
 * hero film on stacked layouts until it's mostly on screen, so the first screen's main paint
 * is the headline, not a sliver of poster at the fold.
 */
export function useShownOnView(ref: RefObject<Element | null>, threshold = 0.6) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return shown;
}

/** Curtain + zoom reveal for a hero frame on stacked layouts, once `shown` (desktop reveals on entrance). */
export function useStackedReveal(scope: RefObject<HTMLElement | null>, shown: boolean, zoom = '[data-media-zoom]') {
  useGSAP(
    () => {
      if (!shown || window.matchMedia(mq.desktop).matches) return;
      const q = gsap.utils.selector(scope);
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        if (ctx.conditions?.reduced) return void gsap.set(q('[data-curtain]'), { autoAlpha: 0 });
        gsap.fromTo(q('[data-curtain]'), { scaleY: 1 }, { scaleY: 0, duration: 1.4, ease: 'expo.inOut' });
        gsap.fromTo(q(zoom), { scale: 1.22 }, { scale: 1, duration: 2.2, ease: flow.ease });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [shown] },
  );
}

const SHEET_TONE = { cream: 'bg-cream', ink: 'bg-ink', white: 'bg-white' } as const;

/**
 * Section background that arrives like a sheet sliding over the previous section: it rises
 * slightly inset with rounded top corners and widens to full-bleed as it reaches the top.
 * Place as the first child of a `relative isolate` section whose own background is the
 * PREVIOUS section's colour (that's what shows in the corners). Clip-path only, scrubbed.
 */
export function Sheet({ tone = 'cream' }: { tone?: keyof typeof SHEET_TONE }) {
  const ref = useRef<HTMLDivElement>(null);
  useNearGSAP(ref, (el) => {
    const mm = gsap.matchMedia();
    mm.add(mq.motionOK, () => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0% 3% 0% 3% round 2.75rem 2.75rem 0rem 0rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0rem 0rem 0rem 0rem)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 15%', scrub: flow.scrub },
        },
      );
    });
    return () => mm.revert();
  });
  return <div ref={ref} aria-hidden className={cn('absolute inset-0 -z-10', SHEET_TONE[tone])} />;
}

/**
 * Text whose words "ink in" as it scrolls through the viewport: each word goes from faint to
 * full as the reading line passes it. With `driven`, a parent timeline animates `[data-word]`.
 */
export function FlowWords({
  text,
  as: Tag = 'p',
  className,
  driven = false,
  dim = 0.16,
}: {
  text: string;
  as?: 'p' | 'blockquote' | 'h2' | 'span';
  className?: string;
  driven?: boolean;
  dim?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useNearGSAP(
    ref,
    (el) => {
      if (driven) return;
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        gsap.fromTo(
          el.querySelectorAll('[data-word]'),
          { opacity: dim },
          { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: flow.scrub } },
        );
      });
      return () => mm.revert();
    },
    '0px 0px 15% 0px',
  );
  const words = text.split(' ');
  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-word className="inline-block">
            {w}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
