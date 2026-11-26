'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq, revealStart } from '@/lib/motion';
import { cn } from '@/lib/cn';

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);
/** Column holds 0–9 twice; landing on the second set gives a full spin. */
const target = (d: number) => -((10 + d) / DIGITS.length) * 100;

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** undefined: roll when scrolled into view. true: roll now. false: hold at zero. */
  play?: boolean;
  delay?: number;
};

/** Odometer-style rolling number (Indian digit grouping). Rolls once. */
export function Counter({ value, prefix = '', suffix = '', className, play, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = value.toLocaleString('en-IN');

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || play === false) return;
      const cols = gsap.utils.toArray<HTMLElement>('[data-col]', el);
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        gsap.fromTo(
          cols,
          { yPercent: 0 },
          {
            yPercent: (i, c: HTMLElement) => target(Number(c.dataset.d)),
            duration: 2,
            ease: 'expo.out',
            delay,
            stagger: { each: 0.08, from: 'end' },
            scrollTrigger: play === undefined ? { trigger: el, start: revealStart, once: true } : undefined,
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [play, value], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={cn('inline-flex items-baseline tabular-nums', className)} aria-label={`${prefix}${text}${suffix}`} role="img">
      <span aria-hidden className="inline-flex leading-none">
        {prefix}
        {[...text].map((c, i) =>
          /\d/.test(c) ? (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden">
              <span data-col data-d={c} className="flex flex-col" style={{ transform: `translateY(${target(Number(c))}%)` }}>
                {DIGITS.map((d, j) => (
                  <span key={j} className="block h-[1em] leading-none">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i}>{c}</span>
          ),
        )}
        {suffix}
      </span>
    </span>
  );
}
