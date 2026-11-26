'use client';

import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { mq } from '@/lib/motion';

type ScrollTo = (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
type Ctx = { lenis: Lenis | null; scrollTo: ScrollTo };

const SmoothScrollContext = createContext<Ctx>({ lenis: null, scrollTo: () => {} });

/**
 * Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. Not created at all under prefers-reduced-motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    if (window.matchMedia(mq.reduced).matches) {
      return () => window.removeEventListener('load', refresh);
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
      prevent: (node) => node.closest('[data-lenis-prevent]') !== null,
    });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- instance is created client-side only
    setLenis(instance);

    return () => {
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback<ScrollTo>(
    (target, opts = {}) => {
      const offset = opts.offset ?? 0;
      if (lenis) {
        lenis.scrollTo(target, { offset, immediate: opts.immediate, duration: 1.4 });
        return;
      }
      const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
      const y = typeof el === 'number' ? el : el ? el.getBoundingClientRect().top + window.scrollY + offset : 0;
      window.scrollTo({ top: y, behavior: 'auto' });
    },
    [lenis],
  );

  return <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>{children}</SmoothScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(SmoothScrollContext);
