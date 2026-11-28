'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { mq } from '@/lib/motion';
import { focusSectionHeading } from '@/lib/focus-section';
import { joinSection } from '@/content/site';
import { useSmoothScroll } from './SmoothScroll';
import { LogoMark } from '@/components/brand/LogoMark';

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });

const NAV_OFFSET = -24;

/**
 * Short orange wipe between routes. Covers, swaps the route, resets scroll,
 * then uncovers. Same-page hash links just smooth-scroll.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lenis, scrollTo } = useSmoothScroll();
  const panel = useRef<HTMLDivElement>(null);
  const pending = useRef<{ path: string; hash: string } | null>(null);

  const arrive = useCallback(
    (hash: string) => {
      scrollTo(hash, { offset: NAV_OFFSET });
      focusSectionHeading(hash.slice(1));
    },
    [scrollTo],
  );

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        // The query picks which form is open, so it has to reach the URL. Plain anchors only scroll.
        const picksForm = url.search || url.hash === `#${joinSection.id}`;
        if (picksForm && url.search !== window.location.search) router.push(href, { scroll: false });
        // Two frames: the mobile menu has to release the scroll lock first.
        requestAnimationFrame(() => requestAnimationFrame(() => (url.hash ? arrive(url.hash) : scrollTo(0))));
        return;
      }
      const reduced = window.matchMedia(mq.reduced).matches;
      if (reduced || !panel.current) {
        router.push(href);
        return;
      }
      pending.current = { path: url.pathname, hash: url.hash };
      lenis?.stop();
      gsap
        .timeline()
        .set(panel.current, { autoAlpha: 1, yPercent: 100 })
        .to(panel.current, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' })
        .add(() => router.push(href, { scroll: false }));
    },
    [arrive, lenis, router, scrollTo],
  );

  useEffect(() => {
    const p = pending.current;
    if (!p || p.path !== pathname || !panel.current) return;
    pending.current = null;
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    lenis?.start();
    const el = panel.current;
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      gsap.to(el, {
        yPercent: -100,
        duration: 0.7,
        delay: 0.08,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(el, { autoAlpha: 0 });
          if (p.hash) arrive(p.hash);
        },
      });
    });
  }, [pathname, lenis, arrive]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={panel}
        aria-hidden
        className="pointer-events-none invisible fixed inset-0 z-[95] flex items-center justify-center bg-orange"
      >
        <LogoMark className="h-20 w-20 text-ink" />
      </div>
    </TransitionContext.Provider>
  );
}

export const usePageTransition = () => useContext(TransitionContext);
