'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { mq } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Props = {
  items: readonly string[];
  /** 1 = travels left, -1 = travels right. */
  direction?: 1 | -1;
  /** Base speed in px/s. */
  speed?: number;
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
  copies?: number;
};

/**
 * Infinite ticker on GSAP's ticker. Scroll velocity boosts speed (and scroll
 * direction flips travel), easing back to the base speed. Pauses on hover and
 * while off-screen. Static under reduced motion.
 */
export function Marquee({ items, direction = 1, speed = 70, className, itemClassName, separator = <Star />, copies = 3 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const tr = track.current;
      if (!el || !tr) return;
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        let width = (tr.firstElementChild as HTMLElement).offsetWidth;
        const ro = new ResizeObserver(() => (width = (tr.firstElementChild as HTMLElement).offsetWidth));
        ro.observe(tr);
        const setX = gsap.quickSetter(tr, 'x', 'px');
        let x = 0;
        let current = speed;
        let boost = 0;
        let scrollDir = 1;
        let hovered = false;
        let visible = false;

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (visible = self.isActive),
          onUpdate: (self) => {
            boost = Math.min(Math.abs(self.getVelocity()) * 0.35, 1400);
            scrollDir = self.direction;
          },
        });
        const tick = (_t: number, dt: number) => {
          if (!visible || !width) return;
          const goal = hovered ? 0 : (speed + boost) * scrollDir;
          current += (goal - current) * 0.07;
          boost *= 0.93;
          x = gsap.utils.wrap(-width, 0, x - current * direction * (dt / 1000));
          setX(x);
        };
        gsap.ticker.add(tick);
        const enter = () => (hovered = true);
        const leave = () => (hovered = false);
        el.addEventListener('pointerenter', enter);
        el.addEventListener('pointerleave', leave);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          ro.disconnect();
          el.removeEventListener('pointerenter', enter);
          el.removeEventListener('pointerleave', leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn('overflow-hidden whitespace-nowrap', className)}>
      <span className="sr-only">{items.join(', ')}</span>
      <div ref={track} aria-hidden className="flex w-max will-change-transform">
        {Array.from({ length: copies }, (_, c) => (
          <div key={c} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={item} className={cn('flex items-center', itemClassName)}>
                {item}
                <span className="mx-[0.45em] inline-flex">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-[0.62em] w-[0.62em]', className)} fill="currentColor" aria-hidden>
      <path d="M12 0l2.6 8.4L23 6l-6.2 6L23 18l-8.4-2.4L12 24l-2.6-8.4L1 18l6.2-6L1 6l8.4 2.4z" />
    </svg>
  );
}
