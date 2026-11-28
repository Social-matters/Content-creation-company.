'use client';

import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { uiSpring } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { useLocalPath } from '@/lib/site-version';
import { nav } from '@/content/site';
import type { Cta, LinkItem } from '@/content/types';
import { useUI } from '@/components/providers/UIProvider';
import { Logo } from '@/components/brand/Logo';
import { TLink } from '@/components/ui/TLink';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { MobileMenu } from './MobileMenu';

export function AudienceToggle({ className, layoutId = 'audience-pill' }: { className?: string; layoutId?: string }) {
  const pathname = useLocalPath();
  const creators = pathname.startsWith('/creators');
  return (
    <div role="group" aria-label="Audience" className={cn('relative flex rounded-full border border-cream/15 bg-ink/45 p-1', className)}>
      {nav.audience.map((a) => {
        const active = (a.href === '/creators') === creators;
        return (
          <TLink
            key={a.href}
            href={a.href}
            aria-current={active ? 'page' : undefined}
            className="relative z-0 rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.08em] sm:px-4"
          >
            {active && <motion.span layoutId={layoutId} className="absolute inset-0 -z-10 rounded-full bg-cream" transition={uiSpring} />}
            <span className={cn('transition-colors duration-300', active ? 'text-ink' : 'text-cream/70 hover:text-cream')}>{a.label}</span>
          </TLink>
        );
      })}
    </div>
  );
}

/**
 * Pill nav. v1: Brands/Creators audience toggle that swaps links and CTA by route.
 * `fixed` (v2): one brand-facing set of links and CTA, no audience toggle and no login.
 */
export function Nav({ fixed }: { fixed?: { links: readonly LinkItem[]; cta: Cta } }) {
  const pathname = useLocalPath();
  const creators = !fixed && pathname.startsWith('/creators');
  const links = fixed?.links ?? (creators ? nav.creatorLinks : nav.links);
  const cta = fixed?.cta ?? (creators ? nav.creatorCta : nav.cta);
  const { openModal, entranceDone } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const bar = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = bar.current;
      if (!el) return;
      let hidden = false;
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          setSolid(y > window.innerHeight * 0.75);
          const hide = self.direction === 1 && y > 260;
          if (hide === hidden) return;
          hidden = hide;
          gsap.to(el, { yPercent: hide ? -150 : 0, duration: hide ? 0.45 : 0.8, ease: hide ? 'power3.in' : 'expo.out', overwrite: true });
        },
      });
      return () => st.kill();
    },
    { scope: bar },
  );

  useGSAP(
    () => {
      if (!entranceDone || !bar.current) return;
      gsap.from(bar.current.querySelectorAll('[data-nav-item]'), { yPercent: -120, autoAlpha: 0, duration: 1, stagger: 0.06, ease: 'expo.out', delay: 0.35 });
    },
    { scope: bar, dependencies: [entranceDone] },
  );

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 text-cream">
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 -z-10 border-b border-cream/10 bg-ink/80 transition-opacity duration-500',
            solid && !menuOpen ? 'opacity-100 backdrop-blur-xl' : 'opacity-0',
          )}
        />
        <div className="container-x flex h-[var(--nav-h)] items-center gap-3">
          <div className="flex flex-1 items-center gap-3 lg:gap-5">
            <TLink href="/" aria-label="Content Creation Company, home" data-nav-item className="shrink-0">
              <Logo className="h-9 w-auto sm:h-10" priority />
            </TLink>
            {!fixed && (
              <div data-nav-item className="hidden sm:block">
                <AudienceToggle />
              </div>
            )}
          </div>

          <nav aria-label="Primary" data-nav-item className="hidden items-center rounded-full border border-cream/15 bg-ink/45 p-1 lg:flex">
            {links.map((l) => (
              <TLink key={l.href} href={l.href} className="rounded-full px-4 py-1.5 text-[0.92rem] font-medium text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream">
                {l.label}
              </TLink>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            {!fixed && (
              <button data-nav-item type="button" onClick={() => openModal('login')} className="hidden whitespace-nowrap text-[0.92rem] font-medium text-cream/80 transition-colors hover:text-cream md:block">
                {nav.login}
              </button>
            )}
            <div data-nav-item className="hidden sm:block">
              <Button cta={cta} className="py-1.5 pl-5 text-[0.72rem]" />
            </div>
            <button
              data-nav-item
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full border border-cream/20 bg-ink/45 lg:hidden"
            >
              <Icon name="menu" size={20} />
              <span className="sr-only">{nav.menu}</span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} cta={cta} audience={!fixed} login={!fixed} />
    </>
  );
}
